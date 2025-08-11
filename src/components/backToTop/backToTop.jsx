import { useState,useEffect } from "react";

import { Button } from "react-bootstrap";

function BackToTop({threshold=300})
{
    const [show,setShow]=useState(false)
    useEffect(()=>
    {
        const onScroll=()=>setShow(window.scrollY > threshold)
        onScroll();
        window.addEventListener('scroll',onScroll,{passive:true})
        return () => window.removeEventListener("scroll", onScroll);
    },[threshold])
    if(!show) return null;
    return(
        <Button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    style={{
      position: "fixed",
      right: 20,
      bottom: 20,
      zIndex: 1050,
      borderRadius: "30%",
      width: 150,
      height: 40,
      padding: 0,
      backgroundColor: "#dae0e0ff",
      color:"black",
      border: "none"
    }}
    aria-label="Back to top"
    title="Back to top"
  >
    <sm>↑Back To Top</sm>
  </Button>
    );
}
export default BackToTop;