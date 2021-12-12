import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GENERATE_COUPON, ENDPOINT } from '../constants'
import Axios from 'axios'


const CouponGenerationPage = () => {

    const [name, setName] = useState()
    const [value, setValue] = useState(0)
    const [qty, setQty] = useState(0)
    const [couponsList, setCouponsList] = useState([])

    const handleGenerateCoupon = async (e) => {
        e.preventDefault()
        console.log("clicked generate")
        const param = {
            name,
            value: parseInt(value),
            quantity: parseInt(qty)
        }

        const response = await Axios.post(GENERATE_COUPON, param)

        if (response.status == 201) {
            setCouponsList(response.data.coupons)
        }

    }

    return (
        <Fragment>
            <div style={{
                border: '1px solid red',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                padding: '50px',
                margin: '20px'
            }}>
                <div>
                    <TextField value={name} id="outlined-basic" label="Product" variant="outlined" onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <TextField value={value} type="number" id="outlined-basic" label="Value" variant="outlined" onChange={(e) => setValue(e.target.value)} />
                </div>
                <div>
                    <TextField value={qty} type="number" id="outlined-basic" label="Quantity" variant="outlined" onChange={(e) => setQty(e.target.value)} />
                </div>
                <div>
                    <Button variant="contained" onClick={handleGenerateCoupon}>Generate</Button>
                </div>
                <div>
                    <Button variant="contained">Print</Button>
                </div>
            </div>

            <div style={{
                border: '1px solid red',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                padding: '50px',
                margin: '20px'
            }}>
                {
                    couponsList.map((coupon, idx) => {
                        return <div>
                            <img src={`${ENDPOINT}/${coupon.couponUrl}`} />
                        </div>
                    })
                }
            </div>

        </Fragment>
    )
}

export default CouponGenerationPage