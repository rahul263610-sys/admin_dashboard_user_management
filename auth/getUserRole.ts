import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "@/components/types/tokenPayload";

export const getUserRole = (): string | null => {

    if(typeof window ==="undefined") return null;
    const token = localStorage.getItem("token");
    if(!token){
        return null;
    }
    try{
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.role;
    }
    catch{
        return null;
    }
}