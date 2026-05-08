import React, { useEffect } from 'react'

import {
  withStyles,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'

import { Container } from './styles'

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundImage: 'linear-gradient(-60deg,#6DE381,#31D19E)',
    border: '0px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 7px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundImage: 'linear-gradient(-60deg,#6DE381,#31D19E)',
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

interface Props {
  name: string
  start: number
  end: number
  initialValue: number
  functionChange: React.Dispatch<React.SetStateAction<number>>
  step?: number
  prefix?: string
  sufix?: string
}

const InputRange: React.FC<Props> = ({
  name,
  start,
  step = 1,
  end,
  functionChange,
  initialValue,
  prefix,
  sufix,
}) => {
  const handleChange = (e: any) => {
    functionChange(e.target.getAttribute('aria-valuenow'))
  }
  useEffect(() => {
    functionChange(initialValue)
  }, [functionChange, initialValue])

  return (
    <Container>
      <div>
        <span>
          {!!prefix && prefix} {start} {!!sufix && sufix}
        </span>
        <span>
          {!!prefix && prefix} {end} {!!sufix && sufix}
        </span>
      </div>
      <PrettoSlider
        min={start}
        max={end}
        step={step}
        valueLabelDisplay="off"
        defaultValue={initialValue}
        onChange={e => handleChange(e)}
      />
    </Container>
  )
}

export default InputRange
