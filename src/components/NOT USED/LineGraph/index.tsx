import React from 'react'

// import { ResponsiveLine, Serie } from '@nivo/line'

// import { Container } from './styles'
// import formatValue from '../../utils/formatValue'
// import formatValueReduced from '../../utils/formatValueReduced'
// import Tooltip from './Tooltip'

// interface Props {
//   data: Serie[]
// }

// const LineGraph: React.FC<Props> = ({ data }) => {
//   return (
//     <Container>
//       <ResponsiveLine
//         data={data}
//         yFormat={v => formatValue(parseInt(v.toString(), 10))}
//         margin={{ top: 5, bottom: 50, left: 65, right: 15 }}
//         xScale={{ format: '%Y-%m-%dT%H:%M:%S.%L%Z', type: 'time' }}
//         xFormat="time:%Y-%m-%dT%H:%M:%S.%L%Z"
//         yScale={{
//           type: 'linear',
//           min: 0,
//           max: 'auto',
//           stacked: false,
//           reverse: false,
//         }}
//         curve="monotoneX"
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           orient: 'bottom',
//           tickSize: 0,
//           tickPadding: 10,
//           tickRotation: 0,
//           format: '%Y',
//           legendOffset: 32,
//           legendPosition: 'middle',
//         }}
//         axisLeft={{
//           orient: 'left',
//           tickSize: 0,
//           tickPadding: 10,
//           tickRotation: 0,

//           format: v => formatValueReduced(parseInt(v.toString(), 10), 3, 'R$'),
//           legendOffset: 0,
//           legendPosition: 'middle',
//         }}
//         enableGridX={false}
//         enableGridY={false}
//         areaOpacity={0.6}
//         colors={'#002266'}
//         enablePoints={false}
//         enableArea
//         enableSlices="x"
//         sliceTooltip={Tooltip}
//         useMesh
//       />
//     </Container>
//   )
// }

// export default LineGraph
