import React, { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import ApiKey from "../../methods/ApiKey";

const Logo = ({ className = 'logo' }) => {

    const [image, setImage] = useState('')

    const logo = () => {
        let value = '/assets/img/fulllogo.png'
        if (image) value = ApiKey.api + 'images/assets/' + image
        return value
    }

    useEffect(() => {
        ApiClient.get('logo').then(res => {
            if (res.success) {
                setImage(res.data.logo)
            }
        })
    }, [])

    return <>
        <img className={className} src={logo()} alt="logo" />
    </>
}

export default Logo