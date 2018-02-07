import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { UserShape } from '../../shared/shape'
import Button from '../../components/button'
import { redirectToLogin } from '../helper'
import profileBg from '../../assets/images/profile-bg.png' //eslint-disable-line
import { getFullName } from '../../utilities/utils'
import { COLOR, FONT_WEIGHT, FONT } from '../../constants/styleGuide'
import { WindowWidth, verticalScale } from '../../utilities/responsiveDimension'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  image: {
    width: WindowWidth(),
    height: verticalScale(177),
    resizeMode: 'cover',
  },
  avator: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: COLOR.LIGHT_YELLOW,
    marginTop: -verticalScale(61),
    marginBottom: verticalScale(50),
  },
  name: {
    fontSize: 48,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLOR.WHITE,
  },
  fullName: {
    fontSize: FONT.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: verticalScale(75),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 27,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: COLOR.DARD_BROWN,
    borderRadius: 2,
  },
  buttonText: {
    fontSize: FONT.L,
    color: COLOR.DARD_BROWN,
  },
})

const Profile = props => {
  const { user } = props
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={profileBg}
      />
      <View style={styles.avator}>
        <Text style={styles.name}>{getFullName(user)}</Text>
      </View>
      <Text style={styles.fullName}>{user.first_name} {user.last_name}</Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={redirectToLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </Button>
      </View>
    </View>
  )
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

Profile.propTypes = {
  user: UserShape.isRequired,
}

export default connect(mapStateToProps)(Profile)
