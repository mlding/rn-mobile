export const toValidWorkSpace = text => (
  text
    .replace(/[^\w.-]/gi, '')
    .replace(/^[-.\s]+/g, '')
    .replace(/[-]+/g, '-')
    .replace(/[.]+/g, '.')
)

export const toValidDomain = text => {
  const regex = /[-.\s]+$/g
  return text.replace(regex, '')
}
