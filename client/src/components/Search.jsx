import { useEffect, useState } from "react";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_KEY= "df82e96de01940289ba2841ff16a5948";

export function Search  ( {foodData, setFoodData}) {
    const [query,setQuery]= useState("");
    useEffect(()=>{
        async function fetchFood() {
                        const res = await fetch(`${URL}?query=${query}&apiKey=${API_KEY}`);
                        const data= await res.json();
                        console.log(data.results);
                        setFoodData(data.results)
                    }
                    fetchFood();
        
    },[query])
    return(
        <div>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} 
        type=""
         />
    </div>
    ) 
}










// import { useEffect, useState } from "react";

// const URL = "";
// const API_KEY= "";

// export default function Search (){
//     const [query, setQuery] = useState("pasta");

//     useEffect(()=> {
//         async function fetchFood() {
//             const res = await fetch(`${URL}?query=${query}&apiKey=${API_KEY}`);
//             const data= await res.json();
//             console.log(data.results);
//         }
//         fetchFood();
//     }, [query]);
// }