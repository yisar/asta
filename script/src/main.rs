pub mod convertor;
pub mod visitors;

use convertor::Convertor;


fn main() {
    let str = "
    <import wx:key=\"aaa\" src=\"1.wxml\"></import>
    ";
    let mut module = Convertor::parse(str).unwrap();
    let (code, _map) = module.transform();
    println!("{:#?}",code)
}
