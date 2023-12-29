import { FC } from 'react'

interface pageProps {
  params: {
    fileId: string
  }
}

const page: FC<pageProps> = ({params: {fileId}}) => {
  return <div>{fileId}</div>
}

export default page