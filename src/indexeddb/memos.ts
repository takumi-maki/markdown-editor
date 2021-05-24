import Dexie from 'dexie'

export interface MemoRecord {
    datetime: string
    title: string
    text: string
}

// データベース名 markdown-editor 
const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' })
// テーブルクラスを取得
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async (title: string, text: string): Promise<void> => {
    const datetime = new Date().toISOString()
    await memos.put({ datetime, title, text })
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
    const totalCount = await memos.count()
    const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
    return pageCount > 0 ? pageCount : 1
}

// データの取得　detetimeの昇順のreverse　toArrayで配列に変換
export const getMemos = (page: number): Promise<MemoRecord[]> => {
    const offset = (page - 1) * NUM_PER_PAGE
    return memos.orderBy('datetime').reverse().offset(offset).limit(NUM_PER_PAGE).toArray()
}