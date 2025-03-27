import jwt from "jsonwebtoken";
const  jwt_key = "4j3&8ox5lz8jf7d&3b76-&o_4r&46g0$yfpy5hru^3jJ3kK303n@$7MW"


function sixDigitOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const checkExpired = (curr,input) =>  new Date(curr) <= new Date(input);
  const addOneMinuteToCurTs = () => new Date(new Date().getTime() + 60000).toISOString();
  const getCurrTs = () => new Date().toISOString();

  const jwtSign = (request) => {
     return jwt.sign(request,jwt_key)
  }

  const addCreatedAndUpdated = (request) => ({...request,createAt: new Date().toISOString(),updatedAt: new Date().toISOString()});
  const addUpdated = (request) => ({...request,updatedAt: new Date().toISOString()});
  const validateToken = (req , res, next) =>{
   const authHeader = req.headers["authorization"]; // Get Authorization header
   console.log({authHeader});

   if (!authHeader) return res.status(403).json({ status : 400 ,message: "Token missing" });
   
   const token = authHeader; // Extract token after 'Bearer'
   console.log({token});

   if (!token) return res.status(403).json({ status : 400,message: "Token not found" });
 
   jwt.verify(token, jwt_key, (err, decoded) => {
     if (err) return res.status(401).json({status : 400, message: "Invalid token" });
 
     req.body.user = decoded; // Save user info for next middleware
     console.log(req.body);
     
     next();
   });
 
  }
  export {sixDigitOtp,addUpdated,addOneMinuteToCurTs,checkExpired,getCurrTs,jwtSign ,addCreatedAndUpdated , validateToken}