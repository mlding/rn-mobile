describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('Should login successfully with correct credential', async () => {
    await element(by.text('Email')).typeText('Bernie@fresnel.cc')
    await element(by.text('Password')).typeText('bernie_mobile')
    await element(by.text('Workspace')).typeText('dev')
    await element(by.text('Login')).tap()
  })
})
