const {Product, Category} = require("../db")
const {Op}=require("sequelize")

const getProductByName= async (req, res)=>{
    try {

        const {carname}=req.query;

        const carsFilt=[]
        const cars= await Product.findAll()

        for (let i = 0; i < cars.length; i++) {

            if(cars[i].name.toLowerCase().includes(carname.toLowerCase()) || cars[i].name.toUpperCase().includes(carname.toUpperCase()) ){
                let carObj={
                    id:cars[i].id,
                    name:cars[i].name,
                    image:cars[i].image,
                    brand:cars[i].brand,
                    description:cars[i].description,
                    price:cars[i].price,
                    stock:cars[i].stock,
                    maker:cars[i].maker,
                    model:cars[i].model,
                    visible:cars[i].visible,
                    visits:cars[i].visits,
                    Categories:cars[i].Categories,
                }
                carsFilt.push(carObj)
            }

        }

        res.status(200).json(carsFilt);

    } catch (error) {
        console.error(error);
        res.status(400).json({error:"Este auto no existe"});
    }
}

module.exports=getProductByName;