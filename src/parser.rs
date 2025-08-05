const RESERVED: &[&str] = &["const", "for", "extends"];

#[derive(Clone, Debug, PartialEq)]
pub enum Node<'a> {
    Block(Vec<Node<'a>>),
    If((Box<Node<'a>>, Box<Node<'a>>, Option<Box<Node<'a>>>)),
    While((Box<Node<'a>>, Box<Node<'a>>)),
    Do((Box<Node<'a>>, Box<Node<'a>>)),
    Switch((Box<Node<'a>>, Box<Node<'a>>)),
    For((Box<Node<'a>>, Box<Node<'a>>)),
    With((Box<Node<'a>>, Box<Node<'a>>)),
    Declaration((&'a str, Vec<Node<'a>>)),
    Return(Option<Box<Node<'a>>>),
    Throw(Box<Node<'a>>),
    Continue(Option<Box<Node<'a>>>),
    Break(Option<Box<Node<'a>>>),
    Blank,
    Null,

    Str(String),
    Interpolation(String),
    Ident(&'a str),
    Double(f64),
    Octal(u64),
    Hexadecimal(u64),
    BinaryNum(u64),
    Idents(Vec<&'a str>),
    Regex((&'a str, Option<&'a str>)),
    List(Vec<Option<Node<'a>>>),
    Object(Vec<Node<'a>>),
    Paren(Box<Node<'a>>),
    Closure((Vec<Node<'a>>, Box<Node<'a>>)),
    Function((Option<&'a str>, Vec<Node<'a>>, Box<Node<'a>>)),
    Shorthand((Box<Node<'a>>, Vec<Node<'a>>, Box<Node<'a>>)),
    Setter(Box<Node<'a>>),
    Getter(Box<Node<'a>>),
    Static(Box<Node<'a>>),
    Generator((Option<&'a str>, Vec<Node<'a>>, Box<Node<'a>>)),
    Class((Option<&'a str>, Option<Box<Node<'a>>>, Vec<Node<'a>>)),
    Field((Box<Node<'a>>, Box<Node<'a>>)),
    Unary(&'a str, Box<Node<'a>>),
    Binary(&'a str, Box<Node<'a>>, Box<Node<'a>>),
    Ternary(Box<Node<'a>>, Box<Node<'a>>, Box<Node<'a>>),

    Import((Option<Box<Node<'a>>>, Box<Node<'a>>)), //default
    Export(Box<Node<'a>>),                          // defalut

    Default(Box<Node<'a>>),
    Try((Box<Node<'a>>, Option<Box<Node<'a>>>, Option<Box<Node<'a>>>)),
    Catch((Option<Box<Node<'a>>>, Box<Node<'a>>)),
    Label((Box<Node<'a>>, Box<Node<'a>>)),
    Case((Box<Node<'a>>, Box<Node<'a>>)),

    Args(Vec<Node<'a>>),
    ListPattern(Vec<Option<Node<'a>>>),
    ObjPattern(Vec<Node<'a>>),
    Splat(Box<Node<'a>>),
    KeyValue((Box<Node<'a>>, Box<Node<'a>>)),
    Param((Box<Node<'a>>, Option<Box<Node<'a>>>)),
    ForTrio(Vec<Option<Node<'a>>>),
    ForOf((Box<Node<'a>>, Box<Node<'a>>)),
    ForIn((Box<Node<'a>>, Box<Node<'a>>)),
    Variable((Option<&'a str>, Box<Node<'a>>)),

    JSXElement((Box<Node<'a>>, Vec<Node<'a>>, Vec<Node<'a>>)),
}

pub fn block(i: &str) -> ParseResult<Node> {
    ws(map(many(case), Node::Block))(i)
}

fn case<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let label = middle(ws(tag("case")), ws(ident), ws(tag(":")));
    let inner = map(pair(boxed(label), boxed(case)), Node::Case);
    ws(choice((inner, default)))(i)
}

fn default<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let label = pair(ws(tag("default")), ws(tag(":")));
    let inner = map(right(label, boxed(default)), Node::Default);
    ws(choice((inner, labeled)))(i)
}

fn labeled<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let label = left(ws(ident), ws(tag(":")));
    let inner = map(pair(boxed(label), boxed(labeled)), Node::Label);
    ws(choice((inner, statement)))(i)
}

pub fn statement<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    choice((
        braces, condition, while_loop, do_loop, for_loop, with, gotos, function,
    ))(i)
}

fn gotos<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let empty = map(peek(tag(";")), |_| Node::Blank);
    left(
        choice((
            imports,
            exports,
            try_catch,
            switch,
            cont,
            brk,
            ret,
            thrw,
            declaration,
            expression,
            empty,
        )),
        end,
    )(i)
}

fn imports<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let from = opt(left(boxed(ws(choice((ident, object)))), ws(tag("from"))));
    let inner = right(ws(tag("import")), pair(from, boxed(ws(quote))));
    map(inner, Node::Import)(i)
}

fn exports<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let default = map(right(ws(tag("default")), boxed(expression)), Node::Default);
    let opts = choice((declaration, function, class, object));
    let inner = right(ws(tag("export")), boxed(choice((opts, default))));
    map(inner, Node::Export)(i)
}

fn try_catch<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let tryb = right(ws(tag("try")), boxed(braces));
    let finally = right(ws(tag("finally")), boxed(braces));
    map(trio(tryb, opt(boxed(catch)), opt(finally)), Node::Try)(i)
}

fn catch<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let exception = middle(ws(tag("(")), boxed(pattern), ws(tag(")")));
    let inner = right(tag("catch"), pair(opt(exception), boxed(braces)));
    ws(map(inner, Node::Catch))(i)
}

fn switch<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let expr = middle(ws(tag("(")), expression, ws(tag(")")));
    let inner = right(ws(tag("switch")), pair(boxed(expr), boxed(braces)));
    map(inner, Node::Switch)(i)
}

fn cont<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(tag("continue"), opt(boxed(ident)));
    ws(map(inner, Node::Continue))(i)
}

fn brk<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(tag("break"), opt(boxed(ident)));
    ws(map(inner, Node::Break))(i)
}

fn ret<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(tag("return"), opt(boxed(choice((jsx_element, expression)))));
    ws(map(inner, Node::Return))(i)
}

fn thrw<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(tag("throw"), boxed(expression));
    ws(map(inner, Node::Throw))(i)
}

fn declaration<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["var", "let", "const"];
    let declaration = ws(pair(one_of(ops), chain(ws(tag(",")), mutation)));
    map(declaration, Node::Declaration)(i)
}

fn condition<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let else_block = ws(right(tag("else"), boxed(labeled)));
    let inner = trio(boxed(paren), boxed(labeled), opt(else_block));
    map(ws(right(tag("if"), inner)), Node::If)(i)
}

fn while_loop<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = pair(boxed(paren), boxed(labeled));
    map(ws(right(tag("while"), inner)), Node::While)(i)
}

fn do_loop<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(tag("do"), boxed(labeled));
    map(ws(outer(inner, ws(tag("while")), boxed(paren))), Node::Do)(i)
}

fn for_loop<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let iter = boxed(choice((for_of, for_in, for_trio)));
    let inner = pair(middle(ws(tag("(")), iter, ws(tag(")"))), boxed(labeled));
    map(ws(right(tag("for"), inner)), Node::For)(i)
}

fn for_trio<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let a = opt(choice((declaration, expression)));
    let b = right(ws(tag(";")), opt(expression));
    let c = right(ws(tag(";")), opt(expression));
    map(trio(a, b, c), |(a, b, c)| Node::ForTrio(vec![a, b, c]))(i)
}

fn for_of<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let expr1 = boxed(variable);
    map(outer(expr1, ws(tag("of")), boxed(expression)), Node::ForOf)(i)
}

fn for_in<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let expr1 = boxed(variable);
    map(outer(expr1, ws(tag("in")), boxed(expression)), Node::ForIn)(i)
}

fn with<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = pair(boxed(paren), boxed(labeled));
    map(ws(right(tag("with"), inner)), Node::With)(i)
}

fn variable<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["var", "let", "const"];
    map(ws(pair(opt(one_of(ops)), boxed(pattern))), Node::Variable)(i)
}

pub fn expression<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(yield1, tag(",")), makechain2)(i)
}

fn yield1<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let yield_star = value(pair(tag("yield"), ws(tag("*"))), "yield*");
    map(prefix(yield_star, yield2), makechain)(i)
}

fn yield2<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(prefix(tag("yield"), mutation), makechain)(i)
}

fn mutation<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &[
        "=", "+=", "-=", "**=", "*=", "/=", "%=", "<<=", ">>>=", ">>=", "&=", "^=", "|=", ":",
    ];
    map(infix(ternary, one_of(ops)), makechain2)(i)
}

fn ternary<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let conds = right(ws(tag("?")), outer(equality, ws(tag(":")), equality));
    ws(map(pair(equality, many(conds)), maketernary))(i)
}

fn equality<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["===", "==", "!==", "!="];
    map(infix(comparison, one_of(ops)), makechain2)(i)
}

fn comparison<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &[">=", "<=", ">", "<", "instanceof", "in", "as"];
    map(infix(bitwise, one_of(ops)), makechain2)(i)
}

fn bitwise<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &[">>>", ">>", "<<"];
    map(infix(logic_or, one_of(ops)), makechain2)(i)
}

fn logic_or<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(logic_and, tag("&&")), makechain2)(i)
}

fn logic_and<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(coalesce, tag("||")), makechain2)(i)
}

fn coalesce<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(bitwise_or, tag("??")), makechain2)(i)
}

fn bitwise_or<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(bitwise_xor, tag("|")), makechain2)(i)
}

fn bitwise_xor<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(bitwise_and, tag("^")), makechain2)(i)
}

fn bitwise_and<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(addition, tag("&")), makechain2)(i)
}

fn addition<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(multiplication, one_of(&["+", "-"])), makechain2)(i)
}

fn multiplication<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(power, one_of(&["*", "/", "%"])), makechain2)(i)
}

fn power<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(infix(negation, tag("**")), makechain2)(i)
}

fn negation<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["!", "~"];
    map(prefix(one_of(ops), prefixes), makechain)(i)
}

fn prefixes<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["++", "--", "+", "-", "typeof", "void", "delete", "await"];
    map(prefix(one_of(ops), postfix), makechain)(i)
}

fn postfix<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let ops = &["++", "--"];
    map(pair(creation, many(ws(one_of(ops)))), makechainb)(i)
}

fn creation<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(prefix(tag("new"), action), makechain)(i)
}

fn action<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let interp = pair(peek(tag("`")), map(string("`"), Node::Interpolation));
    let array = pair(tag("["), left(expression, ws(tag("]"))));
    let opt = pair(tag("?."), ident);
    let dot = pair(tag("."), ident);
    let call = pair(tag("("), left(map(args, Node::Args), ws(tag(")"))));
    let ea = pair(tag("?.["), left(expression, ws(tag("]"))));
    let ec = pair(tag("?.("), left(map(args, Node::Args), ws(tag(")"))));
    let action = pair(
        primitive,
        many(ws(choice((array, opt, dot, call, ea, ec, interp)))),
    );
    map(action, makechain2)(i)
}

fn primitive<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let double = map(double, Node::Double);
    ws(choice((
        jsx_element,
        quote,
        octal,
        hexa,
        binary,
        double,
        generator,
        function,
        object,
        closure,
        paren,
        list,
        regex,
        class,
        ident,
        interpolate,
    )))(i)
}

fn jsx_attribute<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(
        pair(
            ws(ident),
            opt(right(
                ws(tag("=")),
                ws(choice(
                    (
                        quote,
                        map(middle(ws(tag("{")), ws(expression), ws(tag("}"))), |e| {
                            Node::Paren(Box::new(e))
                        }),
                    ), // 表达式值
                )),
            )),
        ),
        |(k, v)| {
            Node::KeyValue((
                Box::new(k),
                Box::new(v.unwrap_or_else(|| Node::Ident("true"))),
            ))
        },
    )(i)
}

fn jsx_closing_tag<'a>(expected_tag: Node<'a>) -> impl Fn(&'a str) -> ParseResult<()> {
    move |i| {
        let (i, actual_tag) = middle(tag("</"), ident, tag(">"))(i)?;
        if actual_tag == expected_tag {
            Ok((i, ()))
        } else {
            Err((i, ParserError::Tag("Mismatched closing tag".into())))
        }
    }
}

fn jsx_child<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    ws(choice((
        map(take_while(|c| c != '<' && c != '{'), |s| {
            Node::Str(s.trim().to_string())
        }),
        map(middle(tag("{"), expression, tag("}")), |e| {
            Node::Paren(Box::new(e))
        }),
        jsx_element,
    )))(i)
}

fn jsx_opening_tag<'a>(i: &'a str) -> ParseResult<(Node<'a>, Vec<Node<'a>>, bool)> {
    map(
        pair(
            pair(ws(tag("<")), ws(ident)),
            pair(
                many(ws(jsx_attribute)),
                map(
                    |i| {
                        let (i, closing) =
                            ws(tag("/>"))(i).unwrap_or_else(|_| ws(tag(">"))(i).unwrap());
                        Ok((i, if closing == "/>" { true } else { false }))
                    },
                    |tag_type| tag_type,
                ),
            ),
        ),
        |((_, tag), (attrs, closing_type))| (tag, attrs, closing_type),
    )(i)
}
fn jsx_element<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let (i, (tag, attrs, closing_type)) = jsx_opening_tag(i)?;

    if closing_type {
        Ok((i, Node::JSXElement((Box::new(tag), attrs, vec![]))))
    } else {
        let (i, children) = many(jsx_child)(i)?;
        let (i, _) = jsx_closing_tag(tag.clone())(i)?;
        Ok((i, Node::JSXElement((Box::new(tag), attrs, children))))
    }
}
fn octal<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(choice((tag("0o"), tag("0O"))), number(8));
    ws(map(inner, Node::Octal))(i)
}

fn hexa<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(choice((tag("0x"), tag("0X"))), number(16));
    ws(map(inner, Node::Hexadecimal))(i)
}

fn binary<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = right(choice((tag("0b"), tag("0B"))), number(2));
    ws(map(inner, Node::BinaryNum))(i)
}

fn regex<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = pair(capture(string("/")), opt(take_while(|c| c.is_alphabetic())));
    ws(map(inner, Node::Regex))(i)
}

fn interpolate<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    map(string("`"), Node::Interpolation)(i)
}

fn quote<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let single_quote = map(string("\""), Node::Str);
    let double_quote = map(string("'"), Node::Str);
    ws(choice((single_quote, double_quote)))(i)
}

fn ident<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let p = identifier;
    map(p, Node::Ident)(i)
}

fn type_ident<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let p = strip_type(typer);
    map(p, Node::Ident)(i)
}

fn identifier<'a>(i: &'a str) -> ParseResult<&'a str> {
    ws(reserved(take_while(|c| c.is_alphanumeric()), RESERVED))(i)
}

fn typer<'a>(i: &'a str) -> ParseResult<&'a str> {
    ws(take_while(|c| 
        c.is_alphanumeric() || 
        c == '<' || c == '>' || 
        c == '[' || c == ']' ||
        c == '|' || c == '_' ||
        c == '.'
    ))(i)
}

fn idents<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = middle(tag("("), chain(ws(tag(",")), identifier), ws(tag(")")));
    ws(map(inner, Node::Idents))(i)
}

fn object<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let item = choice((methods, key_value, ident, splat));
    let object = middle(tag("{"), chain(ws(tag(",")), item), ws(tag("}")));
    ws(map(object, Node::Object))(i)
}

fn field<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = outer(boxed(ident), ws(tag("=")), boxed(expression));
    ws(map(inner, Node::Field))(i)
}

fn methods<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    ws(choice((statik, getter, setter, shorthand)))(i)
}

fn statik<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = boxed(choice((getter, setter, shorthand)));
    ws(map(right(tag("static"), inner), Node::Static))(i)
}

fn getter<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    ws(map(right(tag("get"), boxed(shorthand)), Node::Getter))(i)
}

fn setter<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    ws(map(right(tag("set"), boxed(shorthand)), Node::Setter))(i)
}

fn shorthand<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let computed = middle(tag("["), expression, tag("]"));
    let title = choice((quote, ident, computed));
    let inner = trio(ws(boxed(title)), params, boxed(braces));
    map(inner, Node::Shorthand)(i)
}

fn paren<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let paren = middle(tag("("), boxed(expression), ws(tag(")")));
    ws(map(paren, Node::Paren))(i)
}

fn list<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let items = chain(tag(","), ws(opt(choice((splat, yield1)))));
    let list = middle(tag("["), items, ws(tag("]")));
    ws(map(list, Node::List))(i)
}

fn closure<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let params = ws(choice((map(ident, |a| vec![a]), params)));
    let closure = outer(params, ws(tag("=>")), boxed(expression));
    ws(map(closure, Node::Closure))(i)
}

fn function<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = trio(ws(opt(identifier)), params, boxed(braces));
    let func = ws(right(tag("function"), inner));
    map(func, Node::Function)(i)
}

fn generator<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = trio(ws(opt(identifier)), params, boxed(braces));
    let func = ws(right(pair(tag("function"), ws(tag("*"))), inner));
    map(func, Node::Generator)(i)
}

fn class<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let inner = many(left(choice((field, methods)), end));
    let inner = ws(middle(tag("{"), inner, ws(tag("}"))));
    let extend = ws(opt(right(tag("extends"), boxed(choice((ident, idents))))));
    let title = ws(right(tag("class"), opt(identifier)));
    map(trio(title, extend, inner), Node::Class)(i)
}

fn braces<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    ws(middle(tag("{"), block, ws(tag("}"))))(i)
}

fn params<'a>(i: &'a str) -> ParseResult<Vec<Node<'a>>> {
    let inner = chain(ws(tag(",")), choice((splat, pattern)));
    ws(middle(tag("("), inner, ws(tag(")"))))(i)
}

fn args<'a>(i: &'a str) -> ParseResult<Vec<Node<'a>>> {
    ws(chain(tag(","), choice((splat, expression))))(i)
}

fn splat<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let exp = boxed(right(tag("..."), yield1));
    ws(map(exp, Node::Splat))(i)
}

fn pattern<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let param = choice((list_pattern, object_pattern, type_ident));
    let default = right(ws(tag("=")), ws(expression));
    let inner = pair(boxed(param), opt(boxed(default)));
    ws(map(inner, Node::Param))(i)
}

fn list_pattern<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let items = chain(tag(","), ws(opt(choice((splat, pattern)))));
    let inner = middle(tag("["), items, ws(tag("]")));
    ws(map(inner, Node::ListPattern))(i)
}

fn object_pattern<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let items = chain(tag(","), ws(choice((splat, pattern))));
    let inner = middle(tag("{"), items, ws(tag("}")));
    ws(map(inner, Node::ObjPattern))(i)
}

fn comments<'a>(i: &'a str) -> ParseResult<&'a str> {
    let space = opt(take_while(|c| c == ' ' || c == '\t'));
    let multi = capture(trio(tag("/*"), take_until("*/"), tag("*/")));
    capture(many(right(choice((single_comment, multi)), space)))(i)
}

fn single_comment<'a>(i: &'a str) -> ParseResult<&'a str> {
    let comments = choice((tag("//"), tag("<!--"), tag("-->")));
    capture(trio(comments, take_until("\n"), tag("\n")))(i)
}

fn multi_comment<'a>(i: &'a str) -> ParseResult<&'a str> {
    capture(trio(
        tag("/*"),
        right(take_until("\n"), tag("\n")),
        right(take_until("*/"), tag("*/")),
    ))(i)
}

fn key_value<'a>(i: &'a str) -> ParseResult<Node<'a>> {
    let double_quote = map(string("\""), Node::Str);
    let single_quote = map(string("\'"), Node::Str);
    let computed = middle(tag("["), expression, tag("]"));
    let key = ws(boxed(choice((double_quote, single_quote, ident, computed))));
    let value = boxed(yield1);
    map(
        outer(key, ws(choice((tag(":"), tag("=")))), value),
        Node::KeyValue,
    )(i)
}

fn end<'a>(i: &'a str) -> ParseResult<&'a str> {
    let eol = take_while(|c| c == '\n' || c == '\r');
    let brace = value(peek(tag("}")), "");
    choice((
        ws(eoi),
        ws(tag(";")),
        eol,
        single_comment,
        multi_comment,
        ws(brace),
    ))(i)
}

// Tree walking

pub fn walk<V>(node: Node, mut visit: V) -> Node
where
    V: Copy + FnMut(Node) -> Option<Node>,
{
    if let Some(ret) = visit(node.clone()) {
        return ret;
    }
    match node.clone() {
        Node::Str(a) => Node::Str(a),
        Node::Interpolation(a) => Node::Interpolation(a),
        Node::Regex(a) => Node::Regex(a),
        Node::Ident(a) => Node::Ident(a),
        Node::Idents(a) => Node::Idents(a),
        Node::Double(a) => Node::Double(a),
        Node::Octal(a) => Node::Octal(a),
        Node::Hexadecimal(a) => Node::Hexadecimal(a),
        Node::BinaryNum(a) => Node::BinaryNum(a),
        Node::Getter(a) => Node::Getter(Box::new(walk(*a.clone(), visit))),
        Node::Setter(a) => Node::Setter(Box::new(walk(*a.clone(), visit))),
        Node::Static(a) => Node::Static(Box::new(walk(*a.clone(), visit))),
        Node::Export(a) => Node::Export(Box::new(walk(*a.clone(), visit))),
        Node::Default(a) => Node::Default(Box::new(walk(*a.clone(), visit))),
        Node::Return(a) => Node::Return(a.map(|a| Box::new(walk(*a.clone(), visit)))),
        Node::Continue(a) => Node::Continue(a.map(|a| Box::new(walk(*a.clone(), visit)))),
        Node::Break(a) => Node::Break(a.map(|a| Box::new(walk(*a.clone(), visit)))),
        Node::Throw(a) => Node::Throw(Box::new(walk(*a.clone(), visit))),
        Node::Paren(a) => Node::Paren(Box::new(walk(*a.clone(), visit))),
        Node::Splat(a) => Node::Splat(Box::new(walk(*a.clone(), visit))),
        Node::Unary(a, b) => Node::Unary(a, Box::new(walk(*b.clone(), visit))),
        Node::Variable((a, b)) => Node::Variable((a, Box::new(walk(*b.clone(), visit)))),
        Node::Block(a) => Node::Block(a.iter().map(|n| walk(n.clone(), visit)).collect()),
        Node::List(a) => Node::List(
            a.iter()
                .map(|n| n.as_ref().map(|m| walk(m.clone(), visit)))
                .collect(),
        ),
        Node::ListPattern(a) => Node::ListPattern(
            a.iter()
                .map(|n| n.as_ref().map(|m| walk(m.clone(), visit)))
                .collect(),
        ),
        Node::Object(a) => Node::Object(a.iter().map(|n| walk(n.clone(), visit)).collect()),
        Node::ObjPattern(a) => Node::ObjPattern(a.iter().map(|n| walk(n.clone(), visit)).collect()),
        Node::Args(a) => Node::Args(a.iter().map(|n| walk(n.clone(), visit)).collect()),
        Node::Declaration((a, b)) => {
            Node::Declaration((a, b.iter().map(|n| walk(n.clone(), visit)).collect()))
        }
        Node::While((a, b)) => Node::While((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Do((a, b)) => Node::Do((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Switch((a, b)) => Node::Switch((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::For((a, b)) => Node::For((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::ForOf((a, b)) => Node::ForOf((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::ForIn((a, b)) => Node::ForIn((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::With((a, b)) => Node::With((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Closure((a, b)) => Node::Closure((
            a.iter().map(|n| walk(n.clone(), visit)).collect(),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Import((a, b)) => Node::Import((
            a.map(|b| Box::new(walk(*b.clone(), visit))),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Class((a, b, c)) => Node::Class((
            a,
            b.map(|b| Box::new(walk(*b.clone(), visit))),
            c.iter().map(|n| walk(n.clone(), visit)).collect(),
        )),
        Node::Field((a, b)) => Node::Field((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::KeyValue((a, b)) => Node::KeyValue((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Label((a, b)) => Node::Label((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Case((a, b)) => Node::Case((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Param((a, b)) => Node::Param((
            Box::new(walk(*a.clone(), visit)),
            b.map(|b| Box::new(walk(*b.clone(), visit))),
        )),
        Node::Try((a, b, c)) => Node::Try((
            Box::new(walk(*a.clone(), visit)),
            b.map(|b| Box::new(walk(*b.clone(), visit))),
            c.map(|c| Box::new(walk(*c.clone(), visit))),
        )),
        Node::Catch((a, b)) => Node::Catch((
            a.map(|a| Box::new(walk(*a.clone(), visit))),
            Box::new(walk(*b.clone(), visit)),
        )),
        Node::Function((a, b, c)) => Node::Function((
            a,
            b.iter().map(|n| walk(n.clone(), visit)).collect(),
            Box::new(walk(*c.clone(), visit)),
        )),
        Node::Generator((a, b, c)) => Node::Generator((
            a,
            b.iter().map(|n| walk(n.clone(), visit)).collect(),
            Box::new(walk(*c.clone(), visit)),
        )),
        Node::If((a, b, c)) => Node::If((
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
            c.map(|c| Box::new(walk(*c.clone(), visit))),
        )),
        Node::Binary(a, b, c) => Node::Binary(
            a,
            Box::new(walk(*b.clone(), visit)),
            Box::new(walk(*c.clone(), visit)),
        ),
        Node::Ternary(a, b, c) => Node::Ternary(
            Box::new(walk(*a.clone(), visit)),
            Box::new(walk(*b.clone(), visit)),
            Box::new(walk(*c.clone(), visit)),
        ),
        Node::Shorthand((a, b, c)) => Node::Shorthand((
            Box::new(walk(*a.clone(), visit)),
            b.iter().map(|n| walk(n.clone(), visit)).collect(),
            Box::new(walk(*c.clone(), visit)),
        )),
        Node::JSXElement((a, b, c)) => Node::JSXElement((
            Box::new(walk(*a.clone(), visit)),
            b.iter().map(|n| walk(n.clone(), visit)).collect(),
            c.iter().map(|n| walk(n.clone(), visit)).collect(),
        )),
        Node::ForTrio(_) => node,
        Node::Blank => node,
        Node::Null => node,
    }
}

// Utilities

pub type ParseResult<'a, T> = Result<(&'a str, T), (&'a str, ParserError)>;

#[derive(Debug, PartialEq)]
pub enum ParserError {
    Reserved(String),
    Choice,
    Eof,
    Tag(String),
    TakeWhile,
    MapRes,
}

fn maketernary<'a>(e: (Node<'a>, Vec<(Node<'a>, Node<'a>)>)) -> Node<'a> {
    e.1.iter().fold(e.0, |a, (b, c)| {
        Node::Ternary::<'a>(Box::new(a), Box::new(b.clone()), Box::new(c.clone()))
    })
}

fn makechain<'a>(e: (Vec<&'a str>, Node<'a>)) -> Node<'a> {
    e.0.iter()
        .fold(e.1, |acc, op| Node::Unary::<'a>(*op, Box::new(acc)))
}

fn makechainb<'a>(e: (Node<'a>, Vec<&'a str>)) -> Node<'a> {
    e.1.iter()
        .fold(e.0, |acc, op| Node::Unary::<'a>(*op, Box::new(acc)))
}

fn makechain2<'a>(e: (Node<'a>, Vec<(&'a str, Node<'a>)>)) -> Node<'a> {
    e.1.iter().fold(e.0, |a, (op, b)| {
        Node::Binary::<'a>(*op, Box::new(a), Box::new(b.clone()))
    })
}

pub fn tag(tag: &'static str) -> impl Fn(&str) -> ParseResult<&str> {
    move |i| {
        if let Some(prefix) = i.strip_prefix(tag) {
            Ok((prefix, &i[..tag.len()]))
        } else {
            Err((i, ParserError::Tag(tag.to_string())))
        }
    }
}

pub fn value<'a, P, R, V>(p: P, v: V) -> impl Fn(&'a str) -> ParseResult<V>
where
    P: Fn(&'a str) -> ParseResult<R>,
    V: Clone,
{
    move |i| p(i).map(|(i, _)| (i, v.clone()))
}

pub fn map<'a, P, F, A, B>(p: P, f: F) -> impl Fn(&'a str) -> ParseResult<B>
where
    P: Fn(&'a str) -> ParseResult<A>,
    F: Fn(A) -> B,
{
    move |i| p(i).map(|(i, r)| (i, f(r)))
}

pub fn mapr<'a, P, F, A, B, E>(p: P, f: F) -> impl Fn(&'a str) -> ParseResult<B>
where
    P: Fn(&'a str) -> ParseResult<A>,
    F: Fn(A) -> Result<B, E>,
{
    move |i| p(i).and_then(|(i, r)| f(r).map(|r| (i, r)).or(Err((i, ParserError::MapRes))))
}

pub fn opt<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<Option<R>>
where
    P: Fn(&'a str) -> ParseResult<R>,
{
    move |i| p(i).map(|(i, r)| (i, Some(r))).or(Ok((i, None)))
}

pub fn pair<'a, A, B, X, Y>(a: A, b: B) -> impl Fn(&'a str) -> ParseResult<(X, Y)>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
{
    move |i| a(i).and_then(|(i, r1)| b(i).map(|(i, r2)| (i, (r1, r2))))
}

pub fn trio<'a, A, B, C, X, Y, Z>(a: A, b: B, c: C) -> impl Fn(&'a str) -> ParseResult<(X, Y, Z)>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
    C: Fn(&'a str) -> ParseResult<Z>,
{
    move |i| a(i).and_then(|(i, x)| b(i).and_then(|(i, y)| c(i).map(|(i, z)| (i, (x, y, z)))))
}

pub fn right<'a, A, B, X, Y>(a: A, b: B) -> impl Fn(&'a str) -> ParseResult<Y>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
{
    move |i| a(i).and_then(|(i, _)| b(i).map(|(i, r2)| (i, r2)))
}

pub fn left<'a, A, B, X, Y>(a: A, b: B) -> impl Fn(&'a str) -> ParseResult<X>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
{
    move |i| a(i).and_then(|(i, r1)| b(i).map(|(i, _)| (i, r1)))
}

pub fn middle<'a, A, B, C, X, Y, Z>(a: A, b: B, c: C) -> impl Fn(&'a str) -> ParseResult<Y>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
    C: Fn(&'a str) -> ParseResult<Z>,
{
    move |i| a(i).and_then(|(i, _)| b(i).and_then(|(i, r2)| c(i).map(|(i, _)| (i, r2))))
}

pub fn outer<'a, A, B, C, X, Y, Z>(a: A, b: B, c: C) -> impl Fn(&'a str) -> ParseResult<(X, Z)>
where
    A: Fn(&'a str) -> ParseResult<X>,
    B: Fn(&'a str) -> ParseResult<Y>,
    C: Fn(&'a str) -> ParseResult<Z>,
{
    move |i| a(i).and_then(|(i, x)| b(i).and_then(|(i, _)| c(i).map(|(i, z)| (i, (x, z)))))
}

pub fn one_of<'a>(opts: &'a [&str]) -> impl Fn(&'a str) -> ParseResult<&str> {
    move |i| {
        for opt in opts {
            if let Some(prefix) = i.strip_prefix(opt) {
                return Ok((prefix, &i[..opt.len()]));
            }
        }
        Err((i, ParserError::Choice))
    }
}

pub fn choice<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<R>
where
    P: Choice<'a, R>,
{
    move |i| p.choice(i)
}

pub fn take_while<'a, P>(p: P) -> impl Fn(&'a str) -> ParseResult<&str>
where
    P: Copy + Fn(char) -> bool,
{
    move |i| match i.find(|c| !p(c)) {
        Some(x) if x > 0 => Ok((&i[x..], &i[..x])),
        None if !i.is_empty() => Ok((&i[i.len()..], i)),
        _ => Err((i, ParserError::TakeWhile)),
    }
}

pub fn take_until(p: &'static str) -> impl Fn(&str) -> ParseResult<&str> {
    move |i| i.find(p).map_or(Ok((i, "")), |x| Ok((&i[x..], &i[..x])))
}

pub fn peek<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<R>
where
    P: Fn(&'a str) -> ParseResult<R>,
{
    move |i| p(i).map(|(_, o)| (i, o))
}

pub fn capture<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<&'a str>
where
    P: Fn(&'a str) -> ParseResult<R>,
{
    move |i| p(i).map(|(i2, _)| (i2, &i[..(i2.as_ptr() as usize - i.as_ptr() as usize)]))
}

pub fn reserved<'a, P>(p: P, words: &'a [&'a str]) -> impl Fn(&'a str) -> ParseResult<&'a str>
where
    P: Fn(&'a str) -> ParseResult<&'a str>,
{
    move |i| match p(i) {
        Ok((i, r)) if !words.contains(&r) => Ok((i, r)),
        Ok((_, r)) => Err((i, ParserError::Reserved(r.to_string()))),
        Err((i, r)) => Err((i, r)),
    }
}

pub fn many<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<Vec<R>>
where
    P: Fn(&'a str) -> ParseResult<R>,
{
    move |mut i| {
        let mut r = Vec::new();
        while let Ok((next_input, next_item)) = p(i) {
            i = next_input;
            r.push(next_item);
        }
        Ok((i, r))
    }
}

pub fn chain<'a, S, P, R1, R2>(sep: S, p: P) -> impl Fn(&'a str) -> ParseResult<Vec<R2>>
where
    S: Fn(&'a str) -> ParseResult<R1>,
    P: Fn(&'a str) -> ParseResult<R2>,
    R1: Clone,
    R2: Clone,
{
    move |i| {
        p(i).map(|(i, a)| {
            let mut res = vec![a];
            let mut i = &(*i);
            while let Ok((next_input, next_item)) = right(&sep, &p)(i) {
                i = next_input;
                res.push(next_item);
            }
            if let Ok((new_i, _)) = opt(&sep)(i) {
                i = new_i;
            }
            (i, res)
        })
        .or_else(|_| Ok((i, vec![])))
    }
}

pub fn infix<'a, P, O, R, S>(p: P, o: O) -> impl Fn(&'a str) -> ParseResult<(R, Vec<(S, R)>)>
where
    P: Fn(&'a str) -> ParseResult<R> + 'a,
    O: Fn(&'a str) -> ParseResult<S> + 'a,
    S: PartialEq<&'static str>,
{
    move |i| {
        map(pair(&p, many(pair(ws(&o), &p))), |(first, rest)| {
            (
                first,
                rest.into_iter().filter(|(op, _)| op != &":" && op != &"as").collect(), // remove type
            )
        })(i)
    }
}

pub fn prefix<'a, P, Q, X, Y>(p: P, q: Q) -> impl Fn(&'a str) -> ParseResult<(Vec<X>, Y)>
where
    P: Fn(&'a str) -> ParseResult<X>,
    Q: Fn(&'a str) -> ParseResult<Y>,
{
    move |i| pair(many(ws(&p)), &q)(i)
}

pub fn boxed<'a, P, R>(i: P) -> impl Fn(&'a str) -> ParseResult<Box<R>>
where
    P: Fn(&'a str) -> ParseResult<R>,
{
    map(i, Box::new)
}

pub fn string<'a>(q: &'static str) -> impl Fn(&'a str) -> ParseResult<String> {
    move |i| {
        let escaped = right(
            tag("\\"),
            choice((
                value(tag("n"), "\n"),
                value(tag("r"), "\r"),
                value(tag("t"), "\t"),
                value(tag("v"), "\u{0B}"),
                value(tag("b"), "\u{08}"),
                value(tag("f"), "\u{0C}"),
                value(tag("\\"), "\\"),
                value(tag("/"), "/"),
                value(tag("\""), "\""),
                value(tag("\'"), "\'"),
                value(whitespace, ""),
            )),
        );
        let chars = take_while(|c| c != q.chars().next().unwrap() && c != '\\');
        let inner = map(many(choice((chars, escaped))), |s| s.join(""));
        middle(tag(q), inner, tag(q))(i)
    }
}

pub fn number<'a>(b: u32) -> impl Fn(&'a str) -> ParseResult<u64> {
    move |i| mapr(take_while(|c| c.is_digit(b)), |s| u64::from_str_radix(s, b))(i)
}

pub fn double(i: &str) -> ParseResult<f64> {
    let digit = |i| take_while(|c| c.is_numeric())(i);
    let sign = |i| opt(one_of(&["+", "-"]))(i);
    let num = value(pair(digit, opt(pair(tag("."), opt(digit)))), 0);
    let frac = value(pair(tag("."), digit), 0);
    let exp = opt(trio(choice((tag("e"), tag("E"))), sign, digit));
    mapr(capture(trio(sign, choice((num, frac)), exp)), |s| s.parse())(i)
}

pub const fn eoi(i: &str) -> ParseResult<&str> {
    if i.is_empty() {
        Ok((i, ""))
    } else {
        Err((i, ParserError::Eof))
    }
}

pub fn whitespace(i: &str) -> ParseResult<&str> {
    match i.find(|c: char| !c.is_whitespace()) {
        Some(x) => Ok((&i[x..], &i[..x])),
        _ => Ok(("", i)),
    }
}

pub fn strip_type<'a, P, R>(p: P) -> impl Fn(&'a str) -> ParseResult<&'a str> + 'a
where
    P: Fn(&'a str) -> ParseResult<R> + 'a,
{
    move |i| {
        // 捕获名称部分
        let (i, name) = capture(&p)(i)?;
        
        // 手动实现 "冒号+类型" 部分的解析，不使用 terminated 和 preceded
        let (i, _) = opt(
            map(
                pair(
                    // 解析冒号(前面可以有空格)
                    ws(tag(":")),
                    // 解析类型部分(前面可以有空格)
                    ws(&p)
                ),
                |_| () // 丢弃解析结果，只关心是否成功
            )
        )(i)?;
        
        Ok((i, name))
    }
}

fn ws<'a, T>(item: impl Fn(&'a str) -> ParseResult<T>) -> impl Fn(&'a str) -> ParseResult<T> {
    right(whitespace, right(comments, item))
}

fn st<'a, T>(item: impl Fn(&'a str) -> ParseResult<T>) -> impl Fn(&'a str) -> ParseResult<T> {
    let types = capture(many(right(
        choice((tag("interface"), tag("type"), tag("enum"))),
        right(take_until("}"), tag("}")),
    )));
    right(types, item)
}

pub trait Choice<'a, O> {
    fn choice(&self, i: &'a str) -> ParseResult<'a, O>;
}
macro_rules! choice(
    ($($id:ident)+ , $($num:tt)+) => (
        impl<'a, OUT, $($id: Fn(&'a str) -> ParseResult<'a, OUT>),+>
            Choice<'a, OUT> for ( $($id),+ ) {
            fn choice(&self, i: &'a str) -> ParseResult<'a, OUT> {
                Err(("", ""))$(.or_else(|_| self.$num(i)))*
            }
        }
    );
);
choice!(A B, 0 1);
choice!(A B C, 0 1 2);
choice!(A B C D, 0 1 2 3);
choice!(A B C D E, 0 1 2 3 4);
choice!(A B C D E F, 0 1 2 3 4 5);
choice!(A B C D E F G, 0 1 2 3 4 5 6);
choice!(A B C D E F G H, 0 1 2 3 4 5 6 7);
choice!(A B C D E F G H I, 0 1 2 3 4 5 6 7 8);
choice!(A B C D E F G H I J, 0 1 2 3 4 5 6 7 8 9);
choice!(A B C D E F G H I J K, 0 1 2 3 4 5 6 7 8 9 10);
choice!(A B C D E F G H I J K L, 0 1 2 3 4 5 6 7 8 9 10 11);
choice!(A B C D E F G H I J K L M, 0 1 2 3 4 5 6 7 8 9 10 11 12);
choice!(A B C D E F G H I J K L M N, 0 1 2 3 4 5 6 7 8 9 10 11 12 13);
choice!(A B C D E F G H I J K L M N O, 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14);
choice!(A B C D E F G H I J K L M N O P, 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15);