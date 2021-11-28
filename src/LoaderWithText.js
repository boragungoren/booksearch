import React from 'react'
import { Loader } from 'semantic-ui-react'

const LoaderWithText = props => (
  <Loader active inline="centered" size="large">{props.text}</Loader>
)

export default LoaderWithText