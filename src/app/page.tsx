import { buttonVariants } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Image from 'next/image'
import Link from "next/link";

export default function Home() {
  return (
    <main className='container pb-24'>
      <section className='mt-28 flex flex-col items-center text-center md:mt-40'>
        <p className='rounded-full border bg-base px-6 py-1.5 text-sm font-semibold'>Quill è adesso live!</p>
        <h1 className='mt-4 max-w-5xl text-5xl font-bold md:mt-5 md:text-6xl lg:text-7xl'>
          Conversa con i tuoi <span className='text-primary'>documenti</span> in pochi secondi.
        </h1>
        <p className='mt-4 max-w-prose text-foreground-900 md:mt-5 md:text-lg'>
          Quill ti permette di avere conversazioni con qualsiasi documento PDF. Basta caricare il tuo file e iniziare subito a fare domande.
        </p>
        <Link href='/dashboard' target='_blank' className={buttonVariants({ size: 'lg', className: 'mt-4 md:mt-5' })}>
          Comincia <ArrowRight className='ml-2 h-5 w-5' />
        </Link>
      </section>
      <section className='mx-auto mt-12 max-w-6xl rounded-xl bg-background-950/5 p-2 ring-1 ring-background-900/10 md:mt-16 lg:rounded-2xl lg:p-4'>
        <Image
          src='/dashboard-preview.jpg'
          alt='product preview'
          width={1419}
          height={732}
          quality={100}
          className='rounded-md bg-background shadow-2xl'
        />
      </section>
      <section className='mx-auto max-w-6xl'>
        <div className='mt-32 flex flex-col items-center text-center sm:mt-56'>
          <h2 className='text-4xl font-bold text-foreground-800 sm:text-5xl'>Comincia a chattare in pochi click</h2>
          <p className='text mt-4 text-lg text-foreground-600'>Chattare con i tuoi documenti PDF non è mai stato così intuitivo come con Quill.</p>
        </div>
        <ol className='mt-12 flex flex-col gap-4 px-2 md:mt-16 md:flex-row md:gap-8'>
          <li className='flex flex-col space-y-2 border-t-2 pr-12 pt-4'>
            <span className='text-sm font-medium text-primary'>Step 1</span>
            <span className='text-xl font-semibold'>Crea un account</span>
            <span className='text-foreground-700'>
              Scegli tra il nostro piano gratuito o il nostro{' '}
              <Link href='/pricing' className='text-primary underline underline-offset-2'>
                piano pro
              </Link>
              .
            </span>
          </li>
          <li className='flex flex-col space-y-2 border-t-2 pr-12 pt-4'>
            <span className='text-sm font-medium text-primary'>Step 2</span>
            <span className='text-xl font-semibold'>Carica il tuo file PDF</span>
            <span className='text-foreground-700'>Elaboreremo il file e lo renderemo pronto per la chat.</span>
          </li>
          <li className='flex flex-col space-y-2 border-t-2 pr-12 pt-4'>
            <span className='text-sm font-medium text-primary'>Step 3</span>
            <span className='text-xl font-semibold'>Comincia a fare domande.</span>
            <span className='text-foreground-700'>È tutto. Prova oggi Quill - ci vuole meno di un minuto.</span>
          </li>
        </ol>
        <div className='mx-auto mt-12 max-w-6xl rounded-xl bg-background-950/5 p-2 ring-1 ring-background-900/10 md:mt-16 lg:rounded-2xl lg:p-4'>
          <Image
            src='/file-upload-preview.jpg'
            alt='product preview'
            width={1419}
            height={732}
            quality={100}
            className='rounded-md bg-background shadow-2xl'
          />
        </div>
      </section>
    </main>
  )
}
