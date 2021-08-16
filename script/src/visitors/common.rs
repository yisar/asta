use swc_common::{DUMMY_SP};
use swc_ecmascript::ast;

pub fn opening_title_upper(name: String, node: ast::JSXOpeningElement) {
    let str: &mut str = &mut name.clone()[..];
    titlecase(str);
    // node.name = JSXElementName::Ident(Ident {
    //     span: DUMMY_SP,
    //     optional: false,
    //     sym: format!("{}", str).into(),
    // });
}
pub fn closing_title_upper(name: String, node: ast::JSXClosingElement) {
    let str: &mut str = &mut name.clone()[..];
    titlecase(str);
    // node.name = JSXElementName::Ident(Ident {
    //     span: DUMMY_SP,
    //     optional: false,
    //     sym: format!("{}", str).into(),
    // });
}

pub fn titlecase(s: &mut str) {
    if let Some(r) = s.get_mut(0..1) {
        r.make_ascii_uppercase();
    }
}
