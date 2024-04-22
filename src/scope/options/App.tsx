import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Grid, Input, Page, Radio, Spacer, Text, Toggle, Tooltip, useToasts } from '@geist-ui/core'
import { NoteSyncLocationType, NoteSyncTarget } from '@/types/pkm'

import { NOTE_TEXT } from '@/scope/options/config/note'
import LogseqClient from '@/pkms/logseq/client'
import obsidianClient from '@/pkms/obsidian/client'
import { getUserConfig, updateUserConfig } from '../../config/config'
import { capitalize } from 'lodash-es'
import { QuestionIcon } from '@primer/octicons-react'

export function App() {
    console.log('Options js init.')
    const [loading, setLoading] = useState(false)
    const [connected, setConnected] = useState(false)

    const [note, setNote] = useState<NoteSyncTarget | null>(null)
    const [logseqHost, setLogseqHost] = useState<string>('')
    const [logseqPort, setLogseqPort] = useState<string>('')
    const [logseqToken, setLogseqToken] = useState<string | null>('')
    const [logseqSyncLocationType, setLogseqSyncLocationType] = useState<NoteSyncLocationType>(
        NoteSyncLocationType.CustomPage
    )
    const [logseqCustomPageName, setLogseqCustomPageName] = useState<string | null>(null)

    const [obsidianHost, setObsidianHost] = useState<string>('')
    const [obsidianHttpsPort, setObsidianHttpsPort] = useState<string>('')
    const [isInsecureMode, setIsInsecureMode] = useState<boolean>(false)
    const [obsidianPort, setObsidianPort] = useState<string>('')
    const [obsidianToken, setObsidianToken] = useState<string | null>('')
    const [obsidianSyncLocationType, setObsidianSyncLocationType] = useState<NoteSyncLocationType>(
        NoteSyncLocationType.CustomPage
    )
    const [obsidianCustomPageName, setObsidianCustomPageName] = useState<string | null>(null)

    const { setToast } = useToasts()

    useEffect(() => {
        getUserConfig().then((config) => {
            console.log('init config', config)
            setNote(config.target)
            // logseq
            setLogseqHost(config.logseq.host)
            setLogseqPort(config.logseq.port)
            setLogseqToken(config.logseq.token)
            setLogseqSyncLocationType(config.logseq.pageType)
            setLogseqCustomPageName(config.logseq.pageName)

            // obsidian
            setObsidianHost(config.obsidian.host)
            setObsidianPort(config.obsidian.port)
            setObsidianToken(config.obsidian.token)
            setObsidianHttpsPort(config.obsidian.httpsPort)
            setIsInsecureMode(config.obsidian.insecureMode)
            setObsidianSyncLocationType(config.obsidian.pageType)
            setObsidianCustomPageName(config.obsidian.pageName)
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
        () => (note === NoteSyncTarget.Logseq ? logseqPort : isInsecureMode ? obsidianPort : obsidianHttpsPort),
        [note, obsidianPort, logseqPort, isInsecureMode, obsidianHttpsPort]
    )
    const token = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianToken : logseqToken),
        [note, obsidianToken, logseqToken]
    )

    const pageType = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianSyncLocationType : logseqSyncLocationType),
        [note, obsidianSyncLocationType, logseqSyncLocationType]
    )

    const pageName = useMemo(
        () => (note === NoteSyncTarget.Obsidian ? obsidianCustomPageName : logseqCustomPageName),
        [note, obsidianCustomPageName, logseqCustomPageName]
    )

    const onHostChange = useCallback(
        (val: string) => {
            note === NoteSyncTarget.Logseq ? setLogseqHost(val) : setObsidianHost(val)
            updateUserConfig({
                [note as string]: {
                    host: val,
                },
            })
        },
        [note]
    )

    const onPortChange = useCallback(
        (val: string) => {
            note === NoteSyncTarget.Logseq
                ? setLogseqPort(val)
                : isInsecureMode
                  ? setObsidianPort(val)
                  : setObsidianHttpsPort(val)
            updateUserConfig({
                [note as string]: {
                    // obsidian 特有
                    [isInsecureMode ? 'port' : 'httpsPort']: val,
                },
            })
        },
        [note, isInsecureMode]
    )

    const onTokenChange = useCallback(
        (val: string) => {
            note === NoteSyncTarget.Logseq ? setLogseqToken(val) : setObsidianToken(val)
            updateUserConfig({
                [note as string]: {
                    token: val,
                },
            })
        },
        [note]
    )

    const onSecureModeChange = (checked: boolean) => {
        setIsInsecureMode(!checked)
        updateUserConfig({
            obsidian: {
                insecureMode: !checked,
            } as any,
        })
    }

    const onPageTypeChange = useCallback(
        (val: NoteSyncLocationType) => {
            note === NoteSyncTarget.Logseq ? setLogseqSyncLocationType(val) : setObsidianSyncLocationType(val)
            updateUserConfig({
                [note as string]: {
                    pageType: val,
                },
            })
        },
        [note]
    )

    const onCustomPageChange = useCallback(
        (val: string) => {
            note === NoteSyncTarget.Logseq ? setLogseqCustomPageName(val) : setObsidianCustomPageName(val)
            updateUserConfig({
                [note as string]: {
                    pageName: val,
                },
            })
        },
        [note]
    )

    const checkConnection = useCallback(async () => {
        if (note === NoteSyncTarget.Logseq) {
            setLoading(true)
            const client = new LogseqClient()
            const resp = await client.showMsg('Syncwise Connect!')
            const connectStatus = resp.msg === 'success'
            setConnected(connectStatus)
            if (connectStatus) {
                setToast({ text: `${capitalize(note as string)} Connect Succeed!`, type: 'success' })
            } else {
                setConnected(false)
                setToast({
                    delay: 4000,
                    text: `${capitalize(note as string)}  Connect Failed! ${resp.msg}`,
                    type: 'error',
                })
            }
            setLoading(false)
            return connectStatus
        } else if (note === NoteSyncTarget.Obsidian) {
            setLoading(true)
            const client = obsidianClient
            const resp = await client.checkConnectStatus()
            const connectStatus = resp.msg === 'success'
            setConnected(connectStatus)
            if (connectStatus) {
                setToast({ text: `${capitalize(note as string)} Connect Succeed!`, type: 'success' })
            } else {
                setConnected(false)
                setToast({
                    delay: 4000,
                    text: `${capitalize(note as string)}  Connect Failed! ${resp.msg}`,
                    type: 'error',
                })
            }
            setLoading(false)
            return connectStatus
        }
    }, [note])

    console.log('pageType', pageType)

    return (
        <Page>
            <main className='w-[500px] mx-auto mt-14 pb-10'>
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

                <Spacer h={2} />

                {note && (
                    <>
                        <Text h3 className='mt-5'>
                            {capitalize(note ?? '')} Connect
                        </Text>
                        {note === NoteSyncTarget.Obsidian && (
                            <div className='flex items-center'>
                                <Text>Enable Encrypted(HTTPS) Server</Text>
                                <Spacer w={2} />
                                <Toggle
                                    checked={!isInsecureMode}
                                    scale={1.8}
                                    style={{ marginTop: '-10px' }}
                                    onChange={(e) => onSecureModeChange(e?.target?.checked)}
                                />
                            </div>
                        )}
                        <Grid.Container gap={0} justify='center' height='80px'>
                            <Grid xs={12}>
                                <Input
                                    onChange={(e) => onHostChange(e?.target?.value ?? '')}
                                    crossOrigin={undefined}
                                    value={host}
                                >
                                    Host
                                </Input>
                            </Grid>
                            <Grid xs={12}>
                                <Input
                                    onChange={(e) => onPortChange(e?.target?.value ?? '') as any}
                                    crossOrigin={undefined}
                                    value={port}
                                >
                                    {note === NoteSyncTarget.Obsidian && !isInsecureMode ? 'Https' : 'Http'} Port
                                </Input>
                            </Grid>
                        </Grid.Container>
                        {/* 优化 Bearer  的输入*/}

                        <Input.Password
                            width='100%'
                            onChange={(e) => onTokenChange(e?.target?.value ?? '')}
                            placeholder='Http Authorization Token'
                            crossOrigin={undefined}
                            value={token ?? ''}
                        >
                            Authorization Token
                        </Input.Password>
                    </>
                )}

                <Spacer h={2} />
                {/* <Divider /> */}

                <Button disabled={loading} onClick={checkConnection} placeholder={undefined}>
                    Check {capitalize(note ?? '')} Connection
                </Button>

                <Spacer h={2} />

                {/* 笔记的文件名设置 */}
                <Text h3 className='mt-5'>
                    {capitalize(note ?? '')} Config
                </Text>
                <div className='flex items-center'>
                    <Text className='mt-5 min-w-[140px]'>Sync Location</Text>
                    <div className='ml-4 mt-2'>
                        <Radio.Group value={pageType} onChange={(val) => onPageTypeChange(val as any)} useRow>
                            <Radio value={NoteSyncLocationType.Journal}>Journal</Radio>
                            <Radio value={NoteSyncLocationType.CustomPage}>Custom Page</Radio>
                        </Radio.Group>
                    </div>
                </div>

                {pageType === NoteSyncLocationType.CustomPage && (
                    <div className='flex items-center'>
                        <div className='mt-5 min-w-[140px]'>
                            Custom Page <Spacer w={0.4} />
                            <Tooltip
                                text={`Create a new file in your ${capitalize(
                                    note ?? ''
                                )} or update the content of an existing one.`}
                            >
                                <div className='flex items-center'>
                                    <QuestionIcon size={16} />
                                </div>
                            </Tooltip>
                        </div>
                        <div className='ml-4 mt-2'>
                            <Input
                                onChange={(e) => onCustomPageChange(e?.target?.value ?? '')}
                                crossOrigin={undefined}
                                value={pageName ?? ''}
                            ></Input>
                        </div>
                    </div>
                )}
            </main>
        </Page>
    )
}
