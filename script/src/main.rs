pub mod convertor;
pub mod visitors;

use convertor::Convertor;


fn main() {
    let str = "
    let count = 0
    function add(){
        count++
    }
    ";
    let mut module = Convertor::parse(str).unwrap();
    let (code, _map) = module.transform();
    println!("{:#?}",code)
}
