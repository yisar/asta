use std::path::PathBuf;

fn main() {
    let default = "index.js".to_string();
    let arg = std::env::args().nth(1).unwrap_or(default);
    let entry = PathBuf::from(arg);

    // match bbc::bundle(&entry) {
    //     Ok(data) => println!("{}", data),
    //     Err(err) => eprintln!("{}", err),
    // };
}

#[test]
fn test_bundler_main() {
    assert_eq!(main(), ());
}
