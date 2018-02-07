import { toValidWorkSpace, toValidDomain } from '../utilities'

describe('auth utilities', () => {
  it('#toValidWorkSpace', () => {
    expect(toValidWorkSpace('fresnel-dev')).toEqual('fresnel-dev')
    expect(toValidWorkSpace('fresnel.123')).toEqual('fresnel.123')
    expect(toValidWorkSpace('fresnel.cc')).toEqual('fresnel.cc')
    expect(toValidWorkSpace('fresnel:')).toEqual('fresnel')
    expect(toValidWorkSpace('fresnel*dev')).toEqual('fresneldev')
    expect(toValidWorkSpace('fresnel&')).toEqual('fresnel')
    expect(toValidWorkSpace('fresnel()^')).toEqual('fresnel')
    expect(toValidWorkSpace('fresnel()^')).toEqual('fresnel')
    expect(toValidWorkSpace('fresnel dev')).toEqual('fresneldev')
    expect(toValidWorkSpace('fresnel.....123')).toEqual('fresnel.123')
    expect(toValidWorkSpace('fresnel--------------123')).toEqual('fresnel-123')
    expect(toValidWorkSpace('fresnel/123')).toEqual('fresnel123')
    expect(toValidWorkSpace('fresnel\\123')).toEqual('fresnel123')
  })

  it('#toValidDomain', () => {
    expect(toValidDomain('fresnel-dev----')).toEqual('fresnel-dev')
    expect(toValidDomain('fresnel-dev-.-.-.-')).toEqual('fresnel-dev')
    expect(toValidDomain('fresnel...')).toEqual('fresnel')
    expect(toValidDomain('fresnel--text')).toEqual('fresnel--text')
    expect(toValidDomain('fresnel')).toEqual('fresnel')
  })
})
