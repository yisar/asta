use pek::{
    bundler::{build_asset_graph, emit_bundles, generate_bundles, Config}, parser::{block, statement, walk, Node}, printer::Printer
};


fn main() {
    let config = Config {
        entries: vec!["demo/aaa.js".to_string()],
        out_dir: "dist".to_string()
    };

    println!("构建资源依赖图...");
    let (asset_graph, entries) = build_asset_graph(&config.entries);
    println!("生成bundle...");
    let bundles = generate_bundles(&asset_graph, &entries);
    println!("{:#?}", bundles);
    println!("输出bundle到 {}...", config.out_dir);
    emit_bundles(&bundles, &asset_graph, &config.out_dir);
    println!("打包完成！");
}
