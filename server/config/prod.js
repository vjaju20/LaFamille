module.exports={
    MONGOURI:process.env.MONGOURI,
    JWT_SECRET:process.env.JWT_SECRET,
    SENDGRID_API:process.env.SENDGRID_API,
    EMAIL:process.env.EMAIL
    /* To generate a token we need to create a secret code/key because it is sensitive information
    So we created JWT_SECRET by putting it any number of random words/alphabets/numbers but make sure
    that it should be somewhat which can't be guessed easily
    This is for production side */
}