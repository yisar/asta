use super::visitors::common::{closing_title_upper, opening_title_upper};
use std::{boxed::Box, rc::Rc};
use swc_common::{sync::Lrc, FileName, SourceMap, DUMMY_SP};
use swc_ecmascript::{
    ast,
    codegen::{text_writer::JsWriter, Config, Emitter},
    parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig},
    visit::{Fold, FoldWith},
};

pub struct Convertor {
    pub source_map: Rc<SourceMap>,
    pub module: ast::Module,
}

impl Convertor {
    pub fn parse(str: &str) -> Result<Self, ()> {
        let source_map: Lrc<SourceMap> = Lrc::new(SourceMap::default());
        let fm = source_map.new_source_file(FileName::Custom("".into()), str.into());

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                tsx: true,
                decorators: false,
                ..TsConfig::default()
            }),
            JscTarget::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let module = parser
            .parse_typescript_module()
            .expect("Failed to parse module.");

        Ok(Convertor { source_map, module })
    }
    pub fn transform(&mut self) -> (String, String) {
        let mut u = Upper {};
        let program = ast::Program::Module(self.module.clone());
        program.fold_with(&mut u);
        let (code, map) = self.print();
        (code, map)
    }

    pub fn print(&mut self) -> (String, String) {
        let mut buf = vec![];
        let mut sm_buf = vec![];
        {
            let writer = Box::new(JsWriter::new(
                self.source_map.clone(),
                "\n",
                &mut buf,
                Some(&mut sm_buf),
            ));
            let mut emitter = Emitter {
                cfg: Config { minify: false },
                comments: None,
                cm: self.source_map.clone(),
                wr: writer,
            };

            emitter.emit_module(&self.module).unwrap();
        }
        let src = String::from_utf8(buf).unwrap();

        let mut buf = vec![];
        self.source_map
            .build_source_map_from(&mut sm_buf, None)
            .to_writer(&mut buf)
            .unwrap();

        return (src, String::from_utf8(buf).unwrap());
    }
}

#[derive(Debug)]
pub struct Upper {}

impl Fold for Upper {
    // fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
    //     if let JSXElementName::Ident(id) = &mut node.name {
    //         opening_title_upper(id.sym.to_string(), node);
    //     }

    // }
    // fn fold_jsx_closing_element(&mut self, node: JSXClosingElement) -> JSXClosingElement {
    //     if let JSXElementName::Ident(id) = &mut node.name {
    //         closing_title_upper(id.sym.to_string(), node);
    //     }
    // }
    fn fold_jsx_namespaced_name(&mut self, node: ast::JSXNamespacedName) -> ast::Ident {
        if *node.name.sym == *"key" {
            return ast::Ident {
                span: DUMMY_SP,
                optional: false,
                sym: format!("{}", "key").into(),
            };
        } else {
            return node;
        }
    }
}
