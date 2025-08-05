use bbc::parser::*;

#[test]
fn test_tag() {
    let parser = tag("function");

    assert_eq!(parser("function hello"), Ok((" hello", "function")));
    assert_eq!(
        parser("class Main"),
        Err(("class Main", ParserError::Tag(String::from("function"))))
    );
    assert_eq!(
        parser(""),
        Err(("", ParserError::Tag(String::from("function"))))
    );
}

#[test]
fn test_value() {
    let parser = value(tag("Hello, world!"), "Hallo welt");

    assert_eq!(parser("Hello, world!"), Ok(("", "Hallo welt")));
    assert_eq!(
        parser("Bonjour"),
        Err(("Bonjour", ParserError::Tag(String::from("Hello, world!"))))
    );
}

#[test]
fn test_map() {
    let parser = map(tag("1"), |s| s.parse::<i32>().unwrap());

    assert_eq!(parser("1"), Ok(("", 1)));
    assert_eq!(parser("2"), Err(("2", ParserError::Tag(String::from("1")))));
}

#[test]
fn test_mapr() {
    let parser = mapr(take_while(|c| c.is_alphanumeric()), |s| s.parse::<i32>());

    assert_eq!(parser("123"), Ok(("", 123)));
    assert_eq!(parser("abc"), Err(("", ParserError::MapRes)));
}

#[test]
fn test_opt() {
    let parser = opt(tag("1"));

    assert_eq!(parser("1"), Ok(("", Some("1"))));
    assert_eq!(parser("2"), Ok(("2", None)));
}

#[test]
fn test_pair() {
    let parser = pair(tag("hello "), tag("world"));

    assert_eq!(parser("hello world"), Ok(("", ("hello ", "world"))));
    assert_eq!(
        parser("oh noes"),
        Err(("oh noes", ParserError::Tag(String::from("hello "))))
    );
}

#[test]
fn test_trio() {
    let parser = trio(tag("ein "), tag("zwei "), tag("drei"));

    assert_eq!(parser("ein zwei drei"), Ok(("", ("ein ", "zwei ", "drei"))));
    assert_eq!(
        parser("one two"),
        Err(("one two", ParserError::Tag(String::from("ein "))))
    );
}

#[test]
fn test_right() {
    let parser = right(tag("not me "), tag("me"));

    assert_eq!(parser("not me me"), Ok(("", "me")));
    assert_eq!(
        parser("not me you"),
        Err(("you", ParserError::Tag(String::from("me"))))
    );
}

#[test]
fn test_left() {
    let parser = left(tag("me"), tag("you"));

    assert_eq!(parser("meyou"), Ok(("", "me")));
    assert_eq!(
        parser("youme"),
        Err(("youme", ParserError::Tag(String::from("me"))))
    );
}

#[test]
fn test_middle() {
    let parser = middle(tag("("), tag("secret"), tag(")"));

    assert_eq!(parser("(secret)"), Ok(("", "secret")));
    assert_eq!(
        parser("secret"),
        Err(("secret", ParserError::Tag(String::from("("))))
    );
}

#[test]
fn test_outer() {
    let parser = outer(tag("a"), tag(","), tag("b"));

    assert_eq!(parser("a,b"), Ok(("", ("a", "b"))));
    assert_eq!(
        parser("a+b"),
        Err(("+b", ParserError::Tag(String::from(","))))
    );
}

#[test]
fn test_choice() {
    let parser = choice((tag("1"), tag("2"), tag("3")));

    assert_eq!(parser("1"), Ok(("", "1")));
    assert_eq!(parser("2"), Ok(("", "2")));
    assert_eq!(parser("3"), Ok(("", "3")));
    assert_eq!(parser("4"), Err(("4", ParserError::Tag(String::from("3")))));
}

#[test]
fn test_take_while() {
    let parser = take_while(|c| c.is_numeric());

    assert_eq!(parser("123"), Ok(("", "123")));
    assert_eq!(parser("456"), Ok(("", "456")));
    assert_eq!(parser("abc"), Err(("abc", ParserError::TakeWhile)));
}

#[test]
fn test_take_until() {
    let parser = take_until(" combo breaker");

    assert_eq!(parser("123 combo breaker"), Ok((" combo breaker", "123")));
    assert_eq!(parser("456"), Ok(("456", "")));
}

#[test]
fn test_peek() {
    let parser = peek(tag("The future"));

    assert_eq!(parser("The future"), Ok(("The future", "The future")));
    assert_eq!(
        parser("No future"),
        Err(("No future", ParserError::Tag(String::from("The future"))))
    );
}

#[test]
fn test_capture() {
    let parser = capture(pair(tag("badger"), tag("badger")));

    assert_eq!(parser("badgerbadger"), Ok(("", "badgerbadger")));
    assert_eq!(
        parser("mushroom"),
        Err(("mushroom", ParserError::Tag(String::from("badger"))))
    );
}

#[test]
fn test_reserved() {
    let parser = reserved(take_until("-"), &["if", "while"]);

    assert_eq!(parser("sum-"), Ok(("-", "sum")));
    assert_eq!(
        parser("if-"),
        Err(("if-", ParserError::Reserved(String::from("if"))))
    );
}

#[test]
fn test_many() {
    let parser = many(tag("badger"));

    assert_eq!(parser("badgerbadger"), Ok(("", vec!["badger", "badger"])));
    assert_eq!(parser("not badger"), Ok(("not badger", vec![])));
}

#[test]
fn test_chain() {
    let parser = chain(tag(","), tag("1"));

    assert_eq!(parser("1,1,1"), Ok(("", vec!["1", "1", "1"])));
    assert_eq!(parser("1,1,1,"), Ok(("", vec!["1", "1", "1"])));
    assert_eq!(parser("1"), Ok(("", vec!["1"])));
    assert_eq!(parser("2"), Ok(("2", vec![])));
}

#[test]
fn test_infix() {
    let parser = infix(double, tag("+"));

    assert_eq!(parser("1+1"), Ok(("", (1.0, vec![("+", 1.0)]))));
    assert_eq!(
        parser("1+1+2"),
        Ok(("", (1.0, vec![("+", 1.0), ("+", 2.0)])))
    );
}

#[test]
fn test_prefix() {
    let parser = prefix(tag("!"), double);

    assert_eq!(parser("!!!1"), Ok(("", (vec!["!", "!", "!"], 1.0))));
}

#[test]
fn test_boxed() {
    let parser = boxed(tag("thing"));

    assert_eq!(parser("thing"), Ok(("", Box::new("thing"))));
    assert_eq!(
        parser("not thing"),
        Err(("not thing", ParserError::Tag(String::from("thing"))))
    );
}

#[test]
fn test_string() {
    let parser = string("\"");

    assert_eq!(parser("\"a\""), Ok(("", String::from("a"))));
    assert_eq!(parser("\"abcd\""), Ok(("", String::from("abcd"))));
    assert_eq!(parser("\"abc\"   "), Ok(("   ", String::from("abc"))));
    assert_eq!(
        parser("abcd"),
        Err(("abcd", ParserError::Tag(String::from("\""))))
    );
}

#[test]
fn test_number() {
    let binary = number(2);
    let octal = number(8);
    let hex = number(16);

    assert_eq!(binary("01010"), Ok(("", 0b01010)));
    assert_eq!(binary("1010111"), Ok(("", 0b1010111)));
    assert_eq!(octal("123"), Ok(("", 0o123)));
    assert_eq!(octal("111"), Ok(("", 0o111)));
    assert_eq!(octal("0"), Ok(("", 0o0)));
    assert_eq!(octal("03 "), Ok((" ", 0o3)));
    assert_eq!(octal("012 "), Ok((" ", 0o12)));
    assert_eq!(octal("07654321 "), Ok((" ", 0o07654321)));
    assert_eq!(hex("0123789"), Ok(("", 0x0123789)));
    assert_eq!(hex("ABCDEF"), Ok(("", 0xABCDEF)));
    assert_eq!(hex("abcdef"), Ok(("", 0xabcdef)));
}

#[test]
fn test_double() {
    assert_eq!(double("1.0"), Ok(("", 1.0)));
    assert_eq!(double("2"), Ok(("", 2.0)));
    assert_eq!(double("2e2"), Ok(("", 200.0)));
    assert_eq!(double("2e-2"), Ok(("", 0.02)));
    assert_eq!(double("-2"), Ok(("", -2.0)));
    assert_eq!(double("+2"), Ok(("", 2.0)));
    assert_eq!(double("+.2"), Ok(("", 0.2)));
    assert_eq!(double("-.2"), Ok(("", -0.2)));
}

#[test]
fn test_eoi() {
    assert_eq!(eoi(""), Ok(("", "")));
    assert_eq!(eoi("not the end"), Err(("not the end", ParserError::Eof)));
}

#[test]
fn test_whitespace() {
    let parser1 = right(whitespace, tag("hello"));
    let parser2 = left(tag("hello"), whitespace);

    assert_eq!(parser1("    hello"), Ok(("", "hello")));
    assert_eq!(parser2("hello    "), Ok(("", "hello")));
    assert_eq!(whitespace(" \t\r\n "), Ok(("", " \t\r\n ")));
}
