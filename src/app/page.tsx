import { buttonVariants } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='container'>
      <section className='mt-28 flex flex-col items-center text-center md:mt-40'>
        <p className='rounded-full border border-typography-200 bg-background px-7 py-2 text-sm font-semibold text-typography-700 shadow-md backdrop-blur transition-all hover:border-typography-300 hover:bg-background/50'>
          Quill è adesso live
        </p>
        <h1 className='mt-4 max-w-5xl text-4xl font-bold md:text-6xl lg:text-7xl'>
          Chatta con i tuoi <span className='text-primary'>documenti</span> in pochi istanti.
        </h1>
        <p className='mt-5 max-w-prose text-typography-700 md:text-lg'>
          Quill ti permette di conversare con qualsiasi documento PDF. Non devi fare altro che caricare il tuo file e puoi subito cominciare a porre
          domande.
        </p>
        <Link href='/dashboard' target='_blank' className={buttonVariants({ size: 'lg', className: 'mt-5' })}>
          Inizia <ArrowRight />
        </Link>

        <div>
          <div className='relative isolate'>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
              />
            </div>

            <div>
              <div className='mx-auto max-w-6xl px-6 lg:px-8'>
                <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-separation-900/5 p-2 ring-1 ring-inset ring-separation-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                    <Image
                      src='/dashboard-preview.jpg'
                      alt='product preview'
                      width={1364}
                      height={866}
                      quality={100}
                      className='rounded-md bg-background p-2 shadow-2xl ring-1 ring-separation-900/10 sm:p-8 md:p-20'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
              />
            </div>
          </div>
        </div>
      </section>
      <section className='mx-auto my-32 max-w-5xl md:my-56'>
        <div className='flex flex-col items-center text-center'>
          <h2 className='text-4xl font-bold text-typography-900 md:text-5xl'>Inizia a chattare in pochi minuti</h2>
          <p className='mt-4 text-lg text-typography-600'>Conversare con i tuoi PDF non è mai stato così semplice grazie a Quill.</p>
        </div>
        <ol className='mt-8 flex flex-col gap-4 md:flex-row md:gap-12'>
          <li className='flex flex-col gap-2 border-l-4 border-separation-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
            <span className='terxt-sm font-medium text-primary'>Step 1</span>
            <span className='text-xl font-semibold'>Crea un account</span>
            <span className='mt-2 text-typography-700'>
              Inizia gratuitamente o scegli il nostro{' '}
              <Link href='/pricing' className='text-primary underline underline-offset-2'>
                piano pro
              </Link>
              .
            </span>
          </li>
          <li className='flex flex-col gap-2 border-l-4 border-separation-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
            <span className='terxt-sm font-medium text-primary'>Step 2</span>
            <span className='text-xl font-semibold'>Carica il tuo PDF</span>
            <span className='mt-2 text-typography-700'>Processeremo il tuo PDF e lo renderemo pronto a chattare con te.</span>
          </li>
          <li className='flex flex-col gap-2 border-l-4 border-separation-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
            <span className='terxt-sm font-medium text-primary'>Step 2</span>
            <span className='text-xl font-semibold'>Fai la tua prima domanda</span>
            <span className='mt-2 text-typography-700'>Tutto qua. Prova oggi stesso Quill - ti basta meno di un minuto.</span>
          </li>
        </ol>
        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-separation-900/5 p-2 ring-1 ring-inset ring-separation-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image
                src='/file-upload-preview.jpg'
                alt='uploading preview'
                width={1419}
                height={732}
                quality={100}
                className='rounded-md bg-background p-2 shadow-2xl ring-1 ring-separation-900/10 sm:p-8 md:p-20'
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
