import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Divider, Grid, Input, Page, Radio, Spacer, Text, useToasts } from '@geist-ui/core'
import { NoteSyncTarget } from '../types/pkm.d'
import { NOTE_TEXT } from '../config/note'
import LogseqClient from '../pkms/logseq/client'
import { getUserConfig, updateUserConfig } from '../config/config'

/**
 *  需要设置一堆东西。
 *  logseq
 *      - token
 *      - pagename
 *
 *  obsidian
 *      - ss
 *     - pagename
 */

export function App() {
    console.log('Options js init.')
    const [note, setNote] = useState<NoteSyncTarget | null>(null)
    const [logseqHost, setLogseqHost] = useState<string>('')
    const [logseqPort, setLogseqPort] = useState<string>('')
    const [logseqToken, setLogseqToken] = useState<string | null>('')

    const [obsidianHost, setObsidianHost] = useState<string>('')
    const [obsidianPort, setObsidianPort] = useState<string>('')
    const [obsidianToken, setObsidianToken] = useState<string | null>('')

    const { setToast } = useToasts()

    useEffect(() => {
        getUserConfig().then((config) => {
            setNote(config.target)
            setLogseqHost(config.logseq.host)
            setLogseqPort(config.logseq.port)
            setLogseqToken(config.logseq.token)

            setObsidianHost(config.obsidian.host)
            setObsidianPort(config.obsidian.port)
            setObsidianToken(config.obsidian.token)
        })
    }, [])

    const onNoteChange = useCallback(
        (target: NoteSyncTarget) => {
            setNote(target)
            updateUserConfig({ target })
            setToast({ text: 'Changes saved', type: 'success' })
        },
        [setToast]
    )

    const host = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianHost : logseqHost),
        [note, obsidianHost, logseqHost]
    )
    const port = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianPort : logseqPort),
        [note, obsidianPort, logseqPort]
    )
    const token = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianToken : logseqToken),
        [note, obsidianToken, logseqToken]
    )

    const checkConnection = async (): Promise<boolean> => {
        const client = new LogseqClient()
        const resp = await client.showMsg('Logseq Copliot Connect!')
        const connectStatus = resp.msg === 'success'
        console.log('connectStatus', connectStatus)
        // setConnected(connectStatus);
        if (connectStatus) {
            const version = await (await client.getVersion()).response
            //   setButtonMessage(`Connected to Logseq v${version}!`);
        } else {
            //   setConnected(false);
            //   setButtonMessage(resp.msg);
        }
        // setLoading(false);
        return connectStatus
    }

    return (
        <Page>
            <main className='w-[500px] mx-auto mt-14'>
                <Text h2>Options</Text>
                <Text h3 className='mt-5'>
                    Note Sync Target
                </Text>
                <Radio.Group value={note as string} onChange={(val) => onNoteChange(val as NoteSyncTarget)}>
                    {Object.entries(NOTE_TEXT).map(([value, texts]) => {
                        return (
                            <Radio key={value} value={value}>
                                {texts.title}
                                <Radio.Description>{texts.desc}</Radio.Description>
                            </Radio>
                        )
                    })}
                </Radio.Group>
                {note && (
                    <>
                        <Text h3 className='mt-5'>
                            {note} Config
                        </Text>
                        <Grid.Container gap={0} justify='center' height='80px'>
                            <Grid xs={12}>
                                <Input crossOrigin={undefined} value={host}>
                                    Host
                                </Input>
                            </Grid>
                            <Grid xs={12}>
                                <Input crossOrigin={undefined} value={port}>
                                    Port
                                </Input>
                            </Grid>
                        </Grid.Container>
                        {/* 优化 Bearer  的输入*/}

                        <Input.Password
                            width='100%'
                            placeholder='Http Authorization Token'
                            crossOrigin={undefined}
                            value={token ?? ''}
                        >
                            Authorization Token
                        </Input.Password>
                    </>
                )}

                <Spacer h={2} />
                <Divider />
                <Spacer h={2} />
                <Button onClick={checkConnection} placeholder={undefined}>
                    Check {note} Connection
                </Button>
            </main>
        </Page>
    )
}
