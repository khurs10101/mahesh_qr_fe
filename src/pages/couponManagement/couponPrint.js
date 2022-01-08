import React, { Fragment, useEffect, useState } from 'react'

import {
    Button, TextField, TableContainer,
    Table, TableHead, TableRow, TableBody,
    TableCell, Alert, Box, LinearProgress, Paper
} from "@mui/material"


import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { isUndefined, isEmpty } from "lodash"
import axios from 'axios'
import { ENDPOINT, GET_COUPONS_BY_BATCH } from '../../constants'

let defaultMessage = {
    isError: false,
    message: ""
}

let defaultCouponPosition = {
    startFrom: 0,
    endTo: 0
}
const CouponPrint = (props) => {

    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)
    const [couponList, setCouponList] = useState([])
    const [couponPosition, setCouponPosition] = useState(defaultCouponPosition)

    useEffect(() => {
        handleGetAllCoupons()
    }, [])

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4',
            
        },
        label: {
            height: '21.1mm',
            width: '45.7mm',
            border: '0.5px solid black',
            flexDirection: 'row'
        },
        mainSection: {
            width: '190mm',
            height: '254mm',
            border: '0.2px solid black',
            marginLeft: '10mm',
            marginRight: '10mm',
            marginTop: '21.5mm',
            marginBottom: '21.5mm',
        },
        singleRow: {
            flexDirection: 'row'
        },
        rowGap: {
            marginLeft: '2.4mm'
        },
        qr: {
            height: '20mm',
            width: '20mm'
        },
        fontCouponType: {
            fontSize: '4mm'
        },
        fontCouponText: {
            fontSize: '3mm'
        },
        fontCouponId: {
            fontSize: '1.5mm',
        },
        innerCouponView: {
            padding: '1.5mm'
        }
    });

    const generateDocumnet = () => {
        let lenOfCouponList = couponList.length
        let couponRowJsx = []
        if (lenOfCouponList > 0 && lenOfCouponList <= 48) {
            let noOfRows = Math.ceil(48 / 4)
            for (let i = 0; i < noOfRows; i++) {
                let columnJsx = []
                for (let j = 0; j < 4; j++) {
                    debugger
                    let idx = (i * 4) + j
                    if (idx >= couponPosition.startFrom) {
                        let actualIndex = idx - couponPosition.startFrom
                        if (actualIndex < lenOfCouponList) {
                            let coupon = couponList[actualIndex]
                            let colX = (<Fragment>
                                <View style={styles.label}>
                                    {/* {!isUndefined(coupon.couponUrl) && <Image style={styles.qr} src={`${ENDPOINT}/${coupon.couponUrl}`} />} */}
                                    <View style={styles.innerCouponView}>
                                        {/* <Text style={styles.fontCouponId}>{coupon._id}</Text>
                                        <Text style={styles.fontCouponType}>{coupon.couponType}</Text>
                                        <Text style={styles.fontCouponText}>{coupon.label}</Text> */}
                                    </View>
                                </View>
                                {
                                    j !== 3 && <View style={styles.rowGap}>
                                    </View>
                                }
                            </Fragment>)
                            columnJsx.push(colX)
                        } else {
                            let colX = (<Fragment>
                                <View style={styles.label}>
                                </View>
                                {
                                    j !== 3 && <View style={styles.rowGap}>
                                    </View>
                                }
                            </Fragment>)
                            columnJsx.push(colX)
                        }
                    } else {
                        let colX = (<Fragment>
                            <View style={styles.label}>
                            </View>
                            {
                                j !== 3 && <View style={styles.rowGap}>
                                </View>
                            }
                        </Fragment>)
                        columnJsx.push(colX)
                    }
                }
                let eachRowJsx = (<View style={styles.singleRow}>
                    {columnJsx}
                </View>)
                couponRowJsx.push(eachRowJsx)
            }
        } else {

        }

        return couponRowJsx
    }

    const HandleCouponPDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.mainSection}>
                    {generateDocumnet()}
                </View>
            </Page>
        </Document>
    );


    const handleGetAllCoupons = async () => {
        try {
            setIsLoading(true)
            let params = {
                batchNumber: props.batchData.batchNumber
            }

            let response = await axios.post(GET_COUPONS_BY_BATCH, params)

            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setCouponList(response.data.coupons)
                }
            }
        } catch (e) {
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

    return (<div>
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
        {/* <div style={{
            display: 'flex'
        }}>
            <div style={{
                marginRight: '8px'
            }}>
                <TextField label="Start From" variant="outlined" />
            </div>
            <div>
                <TextField label="End to" variant="outlined" />
            </div>
        </div> */}
        <div>
            {!isEmpty(couponList) &&
                <div style={{
                    height: "100vh",
                    marginTop: '20px'
                }}>
                    <PDFViewer width={"100%"} height={"100%"}>
                        <HandleCouponPDF />
                    </PDFViewer>
                </div>}
        </div>
    </div>)
}

export default CouponPrint