/* 
 * (C) 2020 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 * 
 * Encrypted data decoder
 */
const crypt = require(CONSTANTS.LIBDIR+"/crypt.js");

function decodeIncomingData(apiregentry, _url, data, headers, _servObject) {
    if (!apiregentry.query.encrypted || !apiregentry.query.encrypted.toLowerCase() === "true") return data;  // not encrypted

    return headers["content-type"].toLowerCase() == "application/json" ? 
        crypt.decrypt(JSON.parse(data).data) : crypt.decrypt(data);
}

function encodeResponse(apiregentry, _url, respObj, reqHeaders, _respHeaders, _servObject) {
    if (!apiregentry.query.encrypted || !apiregentry.query.encrypted.toLowerCase() === "true") return respObj;  // not encrypted

    const acceptedEncodings = (reqHeaders["accept"] || "").toLowerCase();
    const sendJSONBack = acceptedEncodings != "application/json" && acceptedEncodings != "application/*" && 
        acceptedEncodings != "*/*" || apiregentry.query.notRESTAPI ? false : true;

    return sendJSONBack ? JSON.stringify({data: crypt.encrypt(respObj)}) : crypt.encrypt(respObj);
}

module.exports = {decodeIncomingData, encodeResponse}