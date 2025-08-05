use bbc::{
    bundler::{build_asset_graph, emit_bundles, generate_bundles, Config}, parser::{block, statement, walk, Node}, printer::Printer
};

// fn main() {
//     let jsx = block(
//         "
//     import {aaa} from 'fre'
//     aaa()
//     ",
//     ).unwrap();

//     let code = generator::generate(jsx.1);

//     println!("{:#?}", code);

//     // let cur_dir = std::env::current_dir().unwrap();
//     // let fixtures = cur_dir.join("tests/fixtures/bundler");
//     // let result = bundle(&fixtures.join("with-dep").join("index.js")).expect("Error");

//     // println!("{:#?}", result);
// }

// fn main() {
//     let js_code = r#"
// import { render, useState } from 'fre'

// function App() {
//   const [count, setCount] = useState(0)
//   return <div aaa="111">111</div>
// }

//     "#;

//     // 解析代码为AST
//     let ast = block(js_code).unwrap();
//     println!("{:#?}", &ast.1);
//     let mut printer = Printer::new("  ", "\n");
//     printer.print(&ast.1);
//     println!("{}", printer.finish());
// }

fn main() {
    let config = Config {
        entries: vec!["demo/aaa.js".to_string()], // 替换为实际入口文件
        out_dir: "dist".to_string()
    };

    // 1. 构建资源图
    println!("构建资源依赖图...");
    let (asset_graph, entries) = build_asset_graph(&config.entries);
    // 3. 生成bundle
    println!("生成bundle...");
    let bundles = generate_bundles(&asset_graph, &entries);
    println!("{:#?}", bundles);
    println!("输出bundle到 {}...", config.out_dir);
    emit_bundles(&bundles, &asset_graph, &config.out_dir);
    println!("打包完成！");
}
