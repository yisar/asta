use crate::bundler::Asset;
use crate::parser::{walk, Node};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

pub fn transform<'a>(root: Node<'a>, asset: &Asset) -> Node<'a> {
    let ns_prefix = asset
        .rel_path
        .replace('\\', "$") // 替换Windows路径分隔符
        .replace('/', "$") // 替换Unix路径分隔符
        .replace('.', "_"); // 替换扩展名分隔符

    let new_ast = walk(root, |child| {
        if let Node::Import((_, _)) = child {
            return Some(Node::Null);
        }
        if let Node::Export(ex) = child {
            return Some(*ex);
        }

        None
    });

    let new2ast = walk(new_ast, |child| {
        if let Node::Ident(ex) = child {
            if asset.exports.contains(ex) {
                let new_name = format!("P${}${}", ns_prefix, ex);
                let static_new_name = Box::leak(new_name.into_boxed_str());
                return Some(Node::Ident(static_new_name));
            } else {
                return Some(Node::Ident(ex));
            }
        }

        if let Node::Function((ex, a, b)) = child {
            if let Some(eex) = ex {
                if asset.exports.contains(eex) {
                    let new_name = format!("P${}${}", ns_prefix, eex);
                    let static_new_name = Box::leak(new_name.into_boxed_str());
                    return Some(Node::Function((Some(static_new_name), a, b)));
                } else {
                    return Some(Node::Function((ex, a, b)));
                }
            }
        }

        None
    });

    walk(new2ast, |child| {
        if let Node::Ident(ex) = child {
            for (path, exports) in &asset.imports {
                println!("{:#?}", ex);

                if exports.contains(&ex.to_string()) {
                    let rel_path = path.replace("/", "$").replace(".", "_");
                    let new_name =
                        format!("P{}${}", rel_path.replace(".", "$").replace("_$", "$"), ex);
                    let static_new_name = Box::leak(new_name.into_boxed_str());
                    return Some(Node::Ident(static_new_name));
                }
                return Some(Node::Ident(ex));
            }
            return Some(child);
        }

        None
    })
}

pub fn get_import_deps(root: &Node) -> HashMap<String, Vec<String>> {
    let imports = RefCell::new(HashMap::new());

    walk(root.clone(), |child| {
        if let Node::Import((Some(im), pp)) = child {
            if let Node::Str(path) = *pp {
                let mut identifiers = Vec::new();

                if let Node::Object(items) = *im.clone() {
                    for i in items {
                        if let Node::Ident(ident) = i {
                            identifiers.push(ident.to_string());
                        }
                    }
                }

                imports
                    .borrow_mut()
                    .entry(path)
                    .or_insert(Vec::new())
                    .extend(identifiers);
            }
        }
        None
    });

    imports.into_inner()
}

pub fn get_export_deps(root: &Node) -> HashSet<String> {
    let exports = RefCell::new(HashSet::new());

    walk(root.clone(), |child| {
        if let Node::Export(ex) = child {
            match &*ex {
                Node::Declaration((_, vals)) => {
                    if let Some(Node::Binary(_, ident, _)) = vals.get(0) {
                        if let Node::Ident(nn) = **ident {
                            exports.borrow_mut().insert(nn.to_string());
                        }
                    }
                }
                Node::Object(objs) => {
                    for item in objs {
                        if let Node::Ident(nn) = item {
                            exports.borrow_mut().insert(nn.to_string());
                        }
                    }
                }
                Node::Function((Some(name), _, _)) => {
                    exports.borrow_mut().insert(name.to_string());
                }
                Node::Class((Some(name), _, _)) => {
                    exports.borrow_mut().insert(name.to_string());
                }
                _ => {}
            }
        }
        None
    });

    exports.into_inner()
}
