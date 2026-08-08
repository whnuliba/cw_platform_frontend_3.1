import { JSEncrypt } from 'jsencrypt'

// 加密
// str 未加密字符串
export function setEncrypt(str) {
    // 实例化JSEncrypt
    const jse = new JSEncrypt()
    // 加密公钥（由C#后端生成）
    // eslint-disable-next-line max-len
    const PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiUwNoHN/cv6+NxwDZDZeK/REFF3gFeVwXgma6RyKMfgxE5/4A2FvtFeRM6uLogH2ieYk4EIELNH5dv1RC/frAKNgr95SmxTyP0xgiO2euQ1TJcEwG6rwScQNCTzaNbwCOUJOEf39U6eBXv5lY884CVdW3itRsWhEldx8YEzJo+lco9hVjev+bqqDdFZwkGxH+Fk4xcw5Dy1kjrVImdg2ZXR3xJ+Drox723O8knsscUf18yy+VUSDh6SpFaPYiY1K/mQTCCsH9aTZH+egiMwibSfjI9mlB284Zd9T50ZrKry8M8KBIIBozZc667bH9QGK70i4LMLiWANyb/dgDhwAqwIDAQAB`

    jse.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----')
    const data = jse.encrypt(str.toString()) // 进行加密
    return data
}

// 解密
// params 待解密字符串
export function getDecrypt(params) {
    // 实例化JSEncrypt
    const jse = new JSEncrypt()
    // 使用前端私钥解密（私钥由C#后端生成）
    // eslint-disable-next-line max-len
    const PRIVATE_KEY = `MIIEowIBAAKCAQEAvnuBHhh9/Mwi4Z8Ea2IfVc7SJYyKkJT+4m4LBJbgxRVPa+ej1iAvJAJ++1CNfH6oVr6tw/wqEIZybTG7+iPm7SzfoW9eb/LYsLR43zLqriYWy7qAd7S/13zILiAGLUy/h9CDYwoXYaNXanVGe0iJb+NXmg7f4MAEo7rR15QHQ8zDtomPI/Fz9vz+o/xzHqsLVnxZIpn4dlCp+7QtzOePnvEda5xqWk4DNaVV2fr9gwfBFd8MyAP+CyBXLAWpmxinRU6knsLKAlqcbOLNjk2+aPNvH9EWHODKWBuMPpdDwQexD+V3/nOp8c07NzSfwXmlZuRKod9SqVY88Pg1r84WwQIDAQABAoIBAD/Fb2vY/U0GNuNcbolY926t6FMj4zwWdeLuvoeRz7yLruRMT+CfM8kVgNe4lzXH3an0+o3zvU19BZAjJ3DOVkCvVktg0rgeEIfQU+s9y630GIuqa9onzFZjc01l8Ut3N2RL3cDpnvxUSC7fBnK9zS2Fak2sjy1ae/Mo15oZ9/itX1WYaVmDmnqopbbopfEL5UkqgwTe8KlZs7iTr5wqBqOfaTS/QU8pEXBy0m3HQwmH2KUfK9ZZOXJGPF+WZ+2OU95mFEscLNwXRZcrhO0SbcLh6dZiNZJBdu3dANsOPsPO5DUhZskLHJMeiFK3yOUcpgK6R51tTLxGYvJBHKd3nlUCgYEAxfLvsCinuORa3oUhWNaKRwa14uTAyhN1Gd6w/jGOcdM7x5vKqahD6iEMay+7B//3xNYjiPVZlyVojBxuvjDMuW9/jg3nWL7taf5WJTVQUNzE/h0vShPFQy6zskgeXYp/ceHNZzkoY3OqnW/qDrDvrLUZJLL7DM/PUXw7AJ5TH18CgYEA9lgEPuP8/h+tH6uxH8rdr4TmgsGrhProAvFw0CTSFsOlOWM2IP7U3/MYsMlWCVB8CZXgfX4z6FsWKlFT4gXwq96VaCfRyyvVQLsxZ10RyjhaZZKQS8p8n8DaRIjRh2Otqi8RJcdoNzGYGrxzZXO+H9vCOudDFRJ8skDyGQwoHd8CgYAMLzH1w+rfBJ9bRxKQZ1RHnvAfMTl0ttHkb8KxQtejxf7OAJbu7n6PsM0U4/E9QtI7eXrieUe0eAcBaNagOly/pU9SrSRqYAY5GgCvdaKl95Dgm2dHxgPEaOGCvdGwrE+/8Mg17FzCEmKUIklj8hwuo08S5Tlyxm/aci0nkpdHPQKBgQCEETXdfZ8BonvPEd34vGrTEX3/NdM9jMJb6ZLglAzp1WO7+3tmfxgjJBHlnVr5zWNiRC7BOKqddE/Syh0dfK/FhKQ23bo0oUBH3tOipZvG/SVBdSzU5S6g+uRJf8xNOFw/c9JOnbQ6euUf2E5JYp7YN5nOuHMXVfzyF61zTjgnowKBgHqozPZH2yTU0bgQfZBsUBFB4vpUkfzB6o6qOOFQ4uiLqvW64LghE1yf7S5+XYz8ZXtIf7yb7sZcJE6XR9BD4gdYl/0KnWRL+oJQMUGDZDBzOcHiHQ8gdyACAC5hFexngJE0RNHtYcg2QjUNMfZMu/eUXJ1EjzisCT0xbwIXv0oZ`

    jse.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + PRIVATE_KEY + '-----END RSA PRIVATE KEY-----')
    const data = jse.decrypt(params) // 解密
    return data
}
