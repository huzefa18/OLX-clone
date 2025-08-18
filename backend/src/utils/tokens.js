const jwt=require('jsonwebtoken')

const access_time='15m';
const refresh_time='7d';

function signAccessToken(user)
{
   return jwt.sign(
        {
            sub:user._id.toString(),tv:user.tokenVersion
        }
        ,process.env.JWT_ACCESS_SECRET,
        {expiresIn:access_time}
    );
}
function signRefreshToken(user)
{
    return jwt.sign(
        {
            sub:user._id.toString(),tv:user.tokenVersion
        }
        ,process.env.JWT_REFRESH_SECRET,
        {expiresIn:refresh_time}
    )
}
module.exports={signAccessToken,signRefreshToken}