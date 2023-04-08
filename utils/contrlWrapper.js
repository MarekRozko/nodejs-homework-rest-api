const contrlWrapper = contrl => {
    const func = async(req, res, next)=> {
        try {
            await contrl(req, res, next);
        } catch(error) {
            next(error);
        }
    };

    return func;
}

module.exports = contrlWrapper;