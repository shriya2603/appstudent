const Joi   = require('joi');

module.exports  =   {
    validateBody:(schema) => {
        return (req, res, next)=>{
            const result = Joi.validate(req.body, schema);
            if(result.error){
                return res.status(400).json(result.error.message);
            }
            if(!req.value){ req.value ={};}
            req.value['body'] = result.value;
            next();
        }
    },

    schemas:{ 
        authSchema :Joi.object().keys({
            email :Joi.string().email().required(),
            password: Joi.string().min(8).max(20).required().error(new Error('Password must be atleast of 8 characters')),
            last_name:Joi.string(),
            first_name:Joi.string(),
            resettoken:Joi.string()
        })
    }
}

