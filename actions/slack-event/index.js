/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * This is a sample action showcasing how to send JSON payload as a Slack message.
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
    // create a Logger
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    try {
        // 'info' is the default level if not set
        logger.info('Calling the main action of product-updated')

        // log parameters, only if params.LOG_LEVEL === 'debug'
        logger.debug(stringParameters(params))

        // check for missing request input parameters and headers
        const requiredHeaders = []
        const errorMessage = checkMissingRequestInputs(params, requiredHeaders)
        if (errorMessage) {
            // return and log client errors
            return errorResponse(400, errorMessage, logger)
        }

        // post the message to external api endpoint
        var paramsData = JSON.parse(JSON.stringify(params))
        var slackText = "Product Updated!"

        const payload = {
            "channel": "app-builder-popup",
            "username": "incoming-webhook",
            "text": JSON.stringify(params),
            "mrkdwn": true
        }

        const res = await fetch("https://hooks.slack.com/services/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", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            return errorResponse(res.status, 'Something is wrong with your Slack webhook URL.', logger)
        }

        const response = {
            statusCode: 200,
            body: {
                message: "Commerce event information sent successfully."
            }
        }

        // log the response status code
        logger.info(`${response.statusCode}: successful request`)
        return response
    } catch (error) {
        // log any server errors
        logger.error(error)
        // return with 500
        return errorResponse(500, 'server error', logger)
    }
}

exports.main = main