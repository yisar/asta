extern crate regex;

use crate::printer::Printer;
use crate::{parser, transformer};
use std::collections::{HashMap, HashSet, VecDeque};
use std::fs;
use std::path::{Path, PathBuf};

use crate::transformer::{get_export_deps, get_import_deps};

pub type Imports = HashMap<String, Vec<String>>;
pub type Exports = HashSet<String>;

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct Asset {
    pub path: String,
    pub rel_path: String,
    pub size: usize,
    pub content: String,
    pub imports: Imports,
    pub exports: Exports,
}

#[derive(Debug, Default, Clone)]
pub struct Bundle {
    pub id: String,
    pub asset_paths: Vec<String>,
    pub size: usize,
}

impl Bundle {
    fn from_asset(asset: &Asset) -> Self {
        let id = generate_bundle_id(&asset.rel_path); // 仅使用当前资产的相对路径（入口文件）
        Bundle {
            id,
            asset_paths: vec![asset.path.clone()],
            size: asset.size,
        }
    }
}


// "aaa/bbb.js" -> "P$aaa$bbb_js"
pub fn generate_bundle_id(entry_rel_path: &str) -> String {
    let transformed = entry_rel_path
        .replace('/', "$") // 替换路径分隔符为 $
        .replace('.', "_"); // 替换扩展名分隔符为 _
    format!("P${}", transformed)
}

#[derive(Debug, Default)]
pub struct Config {
    pub entries: Vec<String>,
    pub out_dir: String,
}

pub fn parse_js_module(content: &str) -> (Vec<String>, Imports, Exports) {
    let mut deps = vec![];
    let mut imports = Imports::new();
    let mut exports = Exports::new();

    let ast = parser::block(&content).expect("Parser error");
    imports = get_import_deps(&ast.1);

    for (raw_path, _) in &imports {
        deps.push(raw_path.clone());
    }
    exports = get_export_deps(&ast.1);

    (deps, imports, exports)
}

pub fn parse_dependencies(asset: &mut Asset) -> Vec<String> {
    let (deps, imports, exports) = parse_js_module(&asset.content);
    asset.imports = imports;
    asset.exports = exports;
    deps
}

pub type AssetGraph = (HashMap<String, Asset>, HashMap<String, Vec<String>>);

pub fn build_asset_graph(entries: &[String]) -> (AssetGraph, Vec<String>) {
    let mut assets: HashMap<String, Asset> = HashMap::new();
    let mut dependencies: HashMap<String, Vec<String>> = HashMap::new();
    let mut entry_paths = vec![];

    fn get_relative_to_base(base_abs: &str, target_abs: &str) -> String {
        let base_path = Path::new(base_abs);
        let target_path = Path::new(target_abs);

        if base_abs == target_abs {
            return target_path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();
        }

        let base_dir = base_path.parent().expect("无法获取基准路径的父目录");
        target_path
            .strip_prefix(base_dir)
            .expect("目标路径不在基准目录下")
            .to_str()
            .unwrap()
            .to_string()
    }

    fn add_asset(
        path: String,
        base_entry_abs: &str,
        assets: &mut HashMap<String, Asset>,
        dependencies: &mut HashMap<String, Vec<String>>,
    ) -> String {
        if assets.contains_key(&path) {
            return path;
        }

        let content =
            fs::read_to_string(&path).unwrap_or_else(|e| panic!("无法读取文件 {}: {}", path, e));
        let size = content.len();

        match Path::new(&path).extension().and_then(|ext| ext.to_str()) {
            Some("js") => (),
            ext => panic!("不支持的文件类型: {:?}（文件：{}）", ext, path),
        }

        let rel_path = get_relative_to_base(base_entry_abs, &path);

        let mut asset = Asset {
            path: path.clone(),
            rel_path,
            size,
            content: content.clone(),
            imports: Imports::new(),
            exports: Exports::new(),
        };

        let raw_deps = parse_dependencies(&mut asset);
        assets.insert(path.clone(), asset);

        let current_dir = Path::new(&path)
            .parent()
            .expect("无法获取父目录")
            .to_str()
            .unwrap();

        let mut processed_deps = vec![];
        for raw_path in raw_deps {
            let dep_abs_path = if Path::new(&raw_path).is_absolute() {
                raw_path.clone()
            } else {
                PathBuf::from(current_dir)
                    .join(&raw_path)
                    .canonicalize()
                    .unwrap_or_else(|e| panic!("无法解析依赖路径 {}: {}", raw_path, e))
                    .to_str()
                    .unwrap()
                    .to_string()
            };

            let resolved_abs_path = add_asset(dep_abs_path, base_entry_abs, assets, dependencies);
            processed_deps.push(resolved_abs_path);
        }

        dependencies.insert(path.clone(), processed_deps);
        path
    }

    for entry in entries {
        let entry_abs_path = PathBuf::from(entry)
            .canonicalize()
            .unwrap_or_else(|e| panic!("解析入口路径失败 {}: {}", entry, e))
            .to_str()
            .unwrap()
            .to_string();

        let entry_path = add_asset(
            entry_abs_path.clone(),
            &entry_abs_path,
            &mut assets,
            &mut dependencies,
        );
        entry_paths.push(entry_path);
    }

    ((assets, dependencies), entry_paths)
}

pub fn generate_bundles(
    asset_graph: &AssetGraph,
    entry_paths: &[String],
) -> HashMap<String, Bundle> {
    let (assets, dependencies) = asset_graph;
    let mut bundles: HashMap<String, Bundle> = HashMap::new();
    let mut asset_to_bundle: HashMap<String, String> = HashMap::new();

    for entry_path in entry_paths {
        let asset = assets.get(entry_path).unwrap();
        let bundle = Bundle::from_asset(asset);
        // 记录入口bundle的ID，后续依赖都合并到这个bundle
        asset_to_bundle.insert(entry_path.clone(), bundle.id.clone());
        bundles.insert(bundle.id.clone(), bundle);
    }

    let mut visited = HashSet::new();
    let mut stack = VecDeque::new();
    for entry_path in entry_paths {
        stack.push_back(entry_path.clone());
    }

    while let Some(current_path) = stack.pop_back() {
        if visited.contains(&current_path) {
            continue;
        }
        visited.insert(current_path.clone());

        let current_bundle_id = asset_to_bundle.get(&current_path).cloned().unwrap();
        let mut current_bundle = bundles.remove(&current_bundle_id).unwrap();

        if let Some(deps_abs) = dependencies.get(&current_path) {
            for dep_abs_path in deps_abs {
                stack.push_back(dep_abs_path.clone());

                // 如果依赖已归属某个bundle则跳过
                if asset_to_bundle.contains_key(dep_abs_path) {
                    continue;
                }

                let dep_asset = assets.get(dep_abs_path).unwrap();
                current_bundle.asset_paths.push(dep_abs_path.clone());
                current_bundle.size += dep_asset.size;

                asset_to_bundle.insert(dep_abs_path.clone(), current_bundle_id.clone());
            }
        }

        bundles.insert(current_bundle_id.clone(), current_bundle);
    }

    bundles
}

pub fn emit_bundles(bundles: &HashMap<String, Bundle>, asset_graph: &AssetGraph, out_dir: &str) {
    let (assets, dependencies) = asset_graph;
    fs::create_dir_all(out_dir).expect("无法创建输出目录");

    println!("\n依赖关系列表（相对路径基于入口文件）：");
    for (source_abs, deps_abs) in dependencies.iter() {
        let source_asset = assets.get(source_abs).unwrap();
        println!(
            "\n{} (相对路径: {}) 的依赖：",
            Path::new(source_abs).file_name().unwrap().to_str().unwrap(),
            source_asset.rel_path
        );

        for dep_abs in deps_abs {
            let dep_asset = assets.get(dep_abs).unwrap();
            let first_import = dep_asset.imports.keys().next().map_or("", |s| s);
            println!(
                "  原始导入路径: {:<10} -> 相对于入口的路径: {}",
                first_import, dep_asset.rel_path
            );
        }
    }

    for (bundle_id, bundle) in bundles.iter() {
        if bundle.asset_paths.is_empty() {
            continue;
        }

        let mut content = String::new();
        content.push_str("(function (global) {");
        for asset_path in &bundle.asset_paths {
            let asset = assets.get(asset_path).unwrap();

            let ast = parser::block(&asset.content).expect("Parser error");
            let new_ast = transformer::transform(ast.1, &asset);
            let mut printer = Printer::new("  ", "\n");
            printer.print(&new_ast);
            content.push_str(&printer.code());
        }
        content.push_str("})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);");

        let out_path = Path::new(out_dir).join(format!("{}.js", bundle_id));
        fs::write(&out_path, content).expect(&format!("无法写入bundle: {:?}", out_path));
        println!(
            "\n生成bundle: {:?}（大小：{} bytes，资源数：{}）",
            out_path,
            bundle.size,
            bundle.asset_paths.len()
        );
    }
}
