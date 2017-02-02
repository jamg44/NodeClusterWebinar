
const cluster = require('cluster');

if (cluster.isMaster) {
  console.log(`Starting master (PID ${process.pid})`);

  const numCPUs = require('os').cpus().forEach((cpu) => {
    //console.log(cpu);
    forkWorker();
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.id} online (PID ${worker.process.pid})`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker PID ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log('Forking...');
    forkWorker();
    restarts++;
  });

  // control restart loop
  var restarts = 0;
  setInterval(() => {
    if (restarts > 3) {
      console.log(`*** Closing main process, too many restarts (${restarts} in 1 second)`);
      process.exit(1);
    }
  }, 1000);

} else {

  require('./www');

}

function forkWorker() {
  const worker = cluster.fork();

  worker.on('message', message => {
    if (message.cmd === 'restart') {
      console.log(`'${message.cmd}' message. Restarting all workers...`);
      return restartAllWorkers();
    }

    if (message.cmd == 'info') {
      const {requestCount, mem} = message.data;
      console.log(`[INFO] worker ${worker.process.pid} ${requestCount} requests, using ${mem}`);
    }

  });

}

function restartAllWorkers() {
  let seconds = 0;
  for (var id in cluster.workers) {

    const worker = cluster.workers[id];
    let timeout;

    setTimeout(() => {
      worker.disconnect();
      timeout = setTimeout(() => worker.kill(), 1000);
    }, ++seconds * 1000);

    worker.on('disconnect', () => {
      clearTimeout(timeout);
    });
  }
}
