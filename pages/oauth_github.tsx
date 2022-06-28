import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";

const GitHubOauth = () => {

    const router = useRouter();
    const [msg, setMsg] = useState<string>("");

    useEffect(() => {
        const _code = router.query.code;
        if(_code){
            setMsg(`Correct! code is ${_code}`)
        }
        else{
            setMsg("Something went wrong");
        }

    }, [])

    return (<div>{msg}</div>)

}

export default GitHubOauth;