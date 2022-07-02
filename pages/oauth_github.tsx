import { useEffect, useState, useContext, ReactElement } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { WebwalletContext } from './_app';
import NavbarLayout from '../src/layout/navbarLayout';
import { createWebwallet } from './signup_webwallet';
import { Flex, Heading, Text} from "@chakra-ui/react";

function GitHubOauth() {

    const router = useRouter();
    const [msg, setMsg] = useState<string>("Redirecting you in a second ...");
    const { webwallet, setWebwallet } = useContext(WebwalletContext)!

    useEffect(() => {
        const newWebwallet = createWebwallet();

        const _code = router.query.code;
        console.log("THIS IS CODE", _code)
        if (_code && newWebwallet) {
            axios.post("https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/add_user", {
                    code: _code,
                    webwallet_address: newWebwallet.address
                })
            .then(res => {
                if(res)
                    return res.data
            })
            .then(data => {
                if(data)
                    return data.authorize
            })
            .then(status => {
                if(status === true){
                    router.push('/signup_webwallet')
                }
            })
        }
        else {
            setMsg("Something went wrong. Please try again");
        }

    }, [])

    return (       
        <Flex width='100%' flexDir='row' justifyContent='center'>
            {msg}
        </Flex>
    )

}

GitHubOauth.getLayout = function(page: ReactElement) {
    return (
        <NavbarLayout>
            {page}
        </NavbarLayout>
    )
}

export default GitHubOauth;
