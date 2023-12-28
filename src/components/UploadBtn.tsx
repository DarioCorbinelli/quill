'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog'
import { Progress } from '@/components/ui/Progress'
import { PLANS } from '@/config/stripe'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc/trpc'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { Cloud, File as FileIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import Dropzone from 'react-dropzone'

interface UploadDropzoneProps {
  isSubscribed: boolean
}

const UploadDropzone: FC<UploadDropzoneProps> = ({ isSubscribed }) => {
  const [progress, setProgress] = useState<number>(5)
  const [isUploadError, setIsUploadError] = useState<boolean>(false)

  const router = useRouter()
  const { toast } = useToast()

  const { startUpload } = useUploadThing(isSubscribed ? 'proFileUploader' : 'freeFileUploader', {
    onUploadProgress(p) {
      setProgress(p < 5 ? 5 : p)
    },
    onUploadError() {
      setIsUploadError(true)
      toast({
        title: 'Errore nel caricamento del file',
        variant: 'destructive',
      })
    },
  })

  const { mutate: startPollingFile } = trpc.getUserFile.useMutation({
    onSuccess(file) {
      router.push(`/dashboard/${file.id}`)
    },
    retry: true,
    retryDelay: 500,
  })

  const handleDrop = async (acceptedFiles: File[]) => {
    setIsUploadError(false)
    const res = await startUpload(acceptedFiles)

    if (!res) return

    const [{ key }] = res

    startPollingFile({ key })
  }

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps, acceptedFiles }) => {
        return (
          <div
            {...getRootProps()}
            className={cn(
              'flex h-64 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-300 bg-background-50 px-12 py-6 text-sm text-foreground-500 hover:bg-background-100',
              { 'bg-background-100': acceptedFiles && acceptedFiles[0] }
            )}
          >
            <Cloud className='h-6 w-6' />
            <p className='mt-2 text-foreground-700'>
              Clicca o <span className='font-semibold'>trascina un file</span> per caricarlo.
            </p>
            <p className='mt-1 text-sm'>Dimesione max: {isSubscribed ? PLANS[1].maxSize : PLANS[0].maxSize}</p>
            {acceptedFiles &&
              acceptedFiles[0] &&
              (!isUploadError ? (
                <>
                  <div className='mt-4 flex items-center rounded border bg-background'>
                    <div className='border-r p-2'>
                      <FileIcon className='h-4 w-4 text-primary' />
                    </div>
                    <span className='inline-block max-w-[12rem] truncate pl-2 pr-3 text-sm'>{acceptedFiles[0].name}</span>
                  </div>
                  <Progress value={progress} indicatorColor={progress === 100 ? 'bg-success-500' : ''} className='mt-4 h-1' />
                  {progress === 100 && (
                    <span className='mt-2 flex items-center gap-1 text-xs text-foreground/50'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Rendirizzamento...
                    </span>
                  )}
                </>
              ) : (
                <div className='mt-4 flex items-center rounded border border-destructive-foreground/40 bg-destructive text-destructive-foreground'>
                  <div className='border-r border-destructive-foreground/40 p-2'>
                    <FileIcon className='h-4 w-4' />
                  </div>
                  <span className='inline-block max-w-[12rem] truncate pl-2 pr-3 text-sm'>{acceptedFiles[0].name}</span>
                </div>
              ))}
            <input type='file' {...getInputProps()} multiple={false} />
          </div>
        )
      }}
    </Dropzone>
  )
}

interface UploadBtnProps {
  isSubscribed: boolean
}

const UploadBtn: FC<UploadBtnProps> = ({ isSubscribed }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Carica PDF</Button>
      </DialogTrigger>
      <DialogContent className='p-10'>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  )
}

export default UploadBtn
