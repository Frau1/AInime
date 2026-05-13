import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const HistoryPage = () => {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('saved_recommendations')
        .select('*')
        .order('created_at', { ascending: false })

      setData(data || [])
    }

    load()
  }, [])

  return (
    <div>
      <h1>Recommendation History</h1>

      {data.map(item => (
        <div key={item.id}>
          <p><b>Prompt:</b> {item.prompt}</p>
          <p><b>Result:</b> {item.result}</p>
        </div>
      ))}
    </div>
  )
}

export default HistoryPage