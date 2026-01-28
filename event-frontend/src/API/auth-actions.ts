import type {LoginResponse, User} from "../utils/types.ts"

export async function login(username:string,password:string):Promise<string>{
    const res = await fetch("http://localhost:5000/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password}),
    })

    if(!res.ok){
        throw new Error("Invalid credentials");
    }
    const data: LoginResponse=await res.json();
    localStorage.setItem("token",data.token);

    return data.token;
}



export async function register(username: string, password: string) {
  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Erreur register") as Error & { status?: number };
    err.status = res.status;        
    throw err;
  }

  return data.token;
}



export async function validateToken():Promise<User>{
    const token= localStorage.getItem("token");

    if(!token){
        throw new Error("no token");
    }
    const res = await fetch("http://localhost:5000/api/me",{
      method:'GET',  
      headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok){
        throw new Error("Invalid token");
    }
    const data = await res.json();
    return data.user

}


