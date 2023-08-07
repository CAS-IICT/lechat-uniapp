import * as $ from './function'
import config from './config'

const api_url = config['api_url']

export async function http(url, data = {}, method = 'post') {
  const response = await uni.request({
    url: api_url + url,
    method,
    data,
    header: {
      token: $.get('token') || '',
      id: $.get('id') || 0
    }
  })

  if (response[0]) throw new Error(response[0].errMsg)

  const status = response[1].statusCode
  const res = response[1].data
  if (status !== 200) throw new Error(res)

  if (res.status === 1) return res.data
  else {
    if (res.status === -1) {
      $.remove('token')
      $.remove('id')
      $.remove('userinfo')
      uni.redirectTo({ url: '/pages/user/login' })
    }
    throw new Error(res.msg)
  }
}

export async function upload(filePath, formData) {
  const response = await uni.uploadFile({
    url: api_url + 'upload',
    filePath,
    name: 'file',
    header: {
      token: $.get('token') || '',
      id: $.get('id') || 0
    },
    formData
  })

  if (response[0]) throw new Error(response[0].errMsg)

  const status = response[1].statusCode
  const data = response[1].data
  if (status !== 200) throw new Error(data)

  const res = JSON.parse(data)
  if (res.status === 1) return res.data
  else {
    if (res.status === -1) {
      $.remove('token')
      $.remove('id')
      $.remove('userinfo')
      uni.redirectTo({ url: '/pages/user/login' })
    }
    throw new Error(res.msg)
  }
}

export async function login() {
  const response = await uni.login({ provider: 'weixin' })

  if (response[0]) throw new Error(response[0].errMsg)
  console.log(response)

  const { code } = response[1]
  if (!code) throw new Error('fail to get wechat code')
  return code
}

export async function url() {
  return config['api_url'] || ''
}
