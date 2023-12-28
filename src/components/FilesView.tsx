'use client'

import { Button } from '@/components/ui/Button'
import { trpc } from '@/lib/trpc/trpc'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react'
import Link from 'next/link'
import { FC, HTMLAttributes, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

interface FilesViewProps extends HTMLAttributes<HTMLUListElement> {}

const FilesView: FC<FilesViewProps> = ({ className, ...rest }) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(null)

  const { status, data: files } = trpc.getUserFiles.useQuery()

  const utils = trpc.useUtils()

  const { mutate: deleteFile } = trpc.deleteUserFile.useMutation({
    onSuccess() {
      utils.getUserFiles.invalidate()
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id)
    },
    onSettled() {
      setCurrentlyDeletingFile(null)
    },
  })

  if (status === 'error') return <div>Error</div>

  if (files && files.length === 0)
    return (
      <div className='mt-16 flex flex-col items-center gap-2'>
        <Ghost className='h-8 w-8 text-foreground-800' />
        <h3 className='text-xl font-semibold'>Piuttosto vuoto da queste parti</h3>
        <p>Carichiamo il tuo primo PDF.</p>
      </div>
    )

  return (
    <ul className={cn('grid-col-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)} {...rest}>
      {status === 'loading'
        ? Array(3)
            .fill('')
            .map((_, i) => <Skeleton key={i} height={100} />)
        : files
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((f) => (
              <li key={f.id} className='col-span-1 divide-y divide-border-200 rounded-lg bg-card shadow transition hover:shadow-lg'>
                <Link href={`/dashboard/${f.id}`} className='flex flex-col gap-2'>
                  <div className='flex w-full items-center justify-between space-x-6 px-6 pt-6'>
                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-primary' />
                    <div className='flex-1 truncate'>
                      <div className='flex items-center space-x-3'>
                        <h3 className='truncate text-lg font-medium text-foreground-900'>{f.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className='mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-foreground-500'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    {format(new Date(f.createdAt), 'MMM yyyy')}
                  </div>

                  <div className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    mocked
                  </div>

                  <Button onClick={() => deleteFile({ id: f.id })} size='sm' className='w-full' variant='destructive'>
                    {currentlyDeletingFile === f.id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash className='h-4 w-4' />}
                  </Button>
                </div>
              </li>
            ))}
    </ul>
  )
}

export default FilesView
