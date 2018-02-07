import React from 'react'
import { View, StyleSheet } from 'react-native'
import LeadWorkerTimesheetList from './leadworkerTimesheetList'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const LeadworkerTimesheet = () => (
  <View style={styles.container}>
    <LeadWorkerTimesheetList />
  </View>)

export default LeadworkerTimesheet

