import React, { useEffect, useState } from "react";
import { SheetJSFT } from '../../utils/xlsxTypes';
import { make_cols } from '../../utils/makeColumns'
import XLSX from 'xlsx';
import { isEmpty, isObject, isUndefined, toLower } from "lodash";
import { Button, Box, LinearProgress, Alert } from "@mui/material";
import axios from "axios";
import { ADD_ALL_INVENTORIES, ADD_OR_SAVE_COMPANY, GET_SINGLE_COMPANY_BY_COMPANY_NAME } from "../../constants";

let initialState = {
    file: {},
    data: [],
    cols: [],
    isValidated: false
}

let defaultMessage = {
    isError: false,
    message: ""
}

const InventoryUpdate = (props) => {

    const [state, setState] = useState(initialState)

    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // console.log(state)
        console.log(JSON.stringify(state.data, null, 2));
    }, [state.data])

    const handleChange = (e) => {
        // debugger
        const { name } = e.target
        if (name == "file") {
            const files = e.target.files
            if (files && files[0]) {
                setState({ ...state, file: files[0] })
            }
        }
    }


    const handleProcessDataForSaving = async () => {
        try {

            if (!isEmpty(state.data) && state.isValidated) {
                setIsLoading(true)
                let dataArray = state.data
                let companyName = !isUndefined(dataArray[0]["__EMPTY_1"]) ? toLower(dataArray[0]["__EMPTY_1"]) : ""
                let response = await axios.post(ADD_OR_SAVE_COMPANY, { companyName })
                if ((response.status === 200 || response.status === 201)) {
                    let company = response.data.company
                    let sizeOfCouponTag = Object.keys(dataArray[1]).length;
                    let couponTags = []
                    for (let i = 2; i < sizeOfCouponTag; i++) {
                        if (!isUndefined(dataArray[1][`__EMPTY_${i}`])) {
                            couponTags.push(toLower(dataArray[1][`__EMPTY_${i}`]))
                        }
                    }

                    let inventoryPayload = []
                    dataArray.slice(2, dataArray.length).map((val, idx) => {
                        let eachItem = {}
                        eachItem.companyName = toLower(company.name)
                        eachItem.serial = !isUndefined(val[`__EMPTY_`]) ? toLower(val[`__EMPTY_`]) : ""
                        eachItem.description = !isUndefined(val[`__EMPTY_1`]) ? toLower(val[`__EMPTY_1`]) : ""
                        eachItem.couponTags = couponTags
                        inventoryPayload.push(eachItem)
                    })

                    console.log(inventoryPayload)
                    const params = {
                        inventoryList: inventoryPayload
                    }
                    response = await axios.post(ADD_ALL_INVENTORIES, params)
                    if (!isUndefined(response)) {
                        if (response.status === 201) {
                            setMessage({
                                isError: false,
                                message: response.data.message
                            })
                        }
                    }
                }

            }
        } catch (e) {
            console.error(e)
            if (e.isAxiosError) {
                if (!isUndefined(e.response)) {
                    if (!isUndefined(e.response.data)) {
                        setMessage({
                            isError: true,
                            message: e.response.data.message
                        })
                    }
                }
            }
        } finally {
            setIsLoading(false)

        }
    }


    const handleFile = (e) => {
        // debugger
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            setState({ data: data, cols: make_cols(ws['!ref']), file: {}, isValidated: true });
        }


        try {
            if (!isUndefined(state.file)) {
                if (rABS) {
                    reader.readAsBinaryString(state.file);
                } else {
                    reader.readAsArrayBuffer(state.file);
                };
            }
            else {
                console.log("select the file again")
            }
        } catch (e) {
            console.error(e)
        }

    }


    const objectWalkThrough = (obj) => {
        let useFullArray = []
        if (!isEmpty(obj)) {
            for (let key in obj) {
                let val = obj[key];
                useFullArray.push(val)
            }

        }
        // console.log(useFullArray)
        return useFullArray
    }


    return (
        <div>
            <div>
                <Box sx={{ width: '100%' }}>
                    {isLoading && <LinearProgress sx={{
                        height: "6px"
                    }} />}
                </Box>
                <div style={{
                    marginTop: '15px'
                }}>
                    {!isEmpty(message.message) && <Alert severity={message.isError ? "error" : "info"}>{message.message}</Alert>}
                </div>
            </div>
            <h1>Inventory update</h1>
            <div>
                <input
                    style={{

                    }}
                    name="file"
                    type="file"
                    className="form-control"
                    id="file"
                    accept={SheetJSFT}
                    onChange={handleChange}
                    onClick={(event) => {
                        event.target.value = null
                        setState({
                            ...state,
                            isValidated: false
                        })
                    }}
                />
                <br />
                {!state.isValidated && <Button onClick={handleFile}>Validate</Button>}
                {state.isValidated && <Button onClick={handleProcessDataForSaving}>Save</Button>}
            </div>
            <div>
                <h2>Meta data section</h2>
                <div>
                    {

                        state.data.slice(0, 2).map((val, idx) => {

                            return <div key={idx}>
                                {objectWalkThrough(val).map((nval, idx) => {
                                    return <span key={idx} style={{
                                        border: '1px solid blue'
                                    }}>{nval}</span>
                                })}
                            </div>
                        })
                    }
                </div>
            </div>
        </div >
    )
}


export default InventoryUpdate