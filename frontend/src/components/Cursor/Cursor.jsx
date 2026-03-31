
export default function Cursor({ dotRef, ringRef }) {
  return (
    <>
      <div ref={dotRef}  className={"Cursor-dot"}  />
      <div ref={ringRef} className={"Cursor-ring"} />
    </>
  )
}
