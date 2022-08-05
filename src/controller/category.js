const {category} = require("../../models")

exports.viewCategory = async (req, res) => {

    let categoryView = await category.findAll()
    if (categoryView == null) {
        res.status(404).send({
            status: "Success",
            message: "Category Is Empty"
        })
    } else if(categoryView !== null) {
        res.status(200).send({
            status: "success",
            categoryView
        })
    }
    
}

exports.addCategory = async (req, res) => {
    let categoryName = req.body.categoryName

    
    if (categoryName == null) {
        res.status(400).send({
            status : "Error",
            message: "Empty Input"
        })
    }else {
        await category.create({
            category_name: categoryName
        })

        res.status(200).send({
            status: "Success",
            categoryData: {
                categoryName
            }
        })
        
    }
}