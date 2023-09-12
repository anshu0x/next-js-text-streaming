// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
    yield encoder.encode("hello");
    await sleep(200);
    yield encoder.encode("my name");
    await sleep(200);
    yield encoder.encode("is anshu");
}

export async function GET() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);
  return new Response(stream);
}
