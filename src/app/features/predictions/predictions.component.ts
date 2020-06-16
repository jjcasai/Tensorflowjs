import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Scalar, Sequential, model, Tensor } from '@tensorflow/tfjs';
import { NormalizeTensor } from 'src/app/shared/models/normalize-tensor.interface';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  model: Sequential
  trainingFeatureTensor: Tensor[]
  testingFeatureTensor: Tensor[]
  trainingLabelTensor: Tensor[]
  testingLabelTensor: Tensor[]
  normalizeFeature: NormalizeTensor
  normalizeLabel: NormalizeTensor

  isLoadingFiles: Boolean = true;
  isTraining: Boolean = null;
  isTesting: Boolean = null;


  trainingLoss: number = 0
  testingLoss: number = 0

  constructor() { }

  ngOnInit(): void {

    this.run()
  }


  async  plot(datapoints, featureName) {

    tfvis.render.scatterplot(
      { name: `${featureName} vs House Price` },
      { values: [datapoints], series: ["original"] },
      {
        xLabel: featureName,
        yLabel: "Price"
      }
    )
  }

  createModel(): Sequential {

    const model = tf.sequential()

    model.add(
      tf.layers.dense({
        units: 1,
        useBias: true,
        activation: 'linear',
        inputDim: 1
      })
    )

    const optimizer = tf.train.sgd(0.1);
    model.compile({
      loss: 'meanSquaredError',
      optimizer
    })


    return model;

  }

  normalize(tensor) {

    const min = tensor.min()
    const max = tensor.max()

    const normalizeTensor = tensor.sub(min).div(max.sub(min))

    return {
      tensor: normalizeTensor,
      min: min,
      max: max
    }
  }

  denormalized(tensor, min, max) {

    return tensor.mul(max.sub(min)).add(min)
  }

  async  train(model, trainingFeatureTensor, trainingLabelsTensor) {

    const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks(
      { name: "Training PErformance" },
      ['loss']
    )

    return model.fit(trainingFeatureTensor, trainingLabelsTensor, {
      batchSize: 32,
      epochs: 20,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd
      }
    })
  }

  async  run() {

    this.isLoadingFiles = true

    //import from CSV
    const houseDataset = tf.data.csv('assets/kc_house_data.csv')

    //extract x and y values to plot
    const pointsDataset = houseDataset.map((record: any) => (
      {
        x: record.sqft_living,
        y: record.price
      }
    ))

    const points = await pointsDataset.toArray()
    if (points.length % 2 != 0) {
      points.pop()
    }

    tf.util.shuffle(points)
    this.plot(await points, "Square feet")

    //extract Features (inputs)
    const featureValues = await points.map(p => p.x)
    const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1])

    //extract Labels (outputs)
    const labelValues = await points.map(p => p.y)
    const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1])

    //normalize features and labels
    this.normalizeFeature = this.normalize(featureTensor)
    this.normalizeLabel = this.normalize(labelTensor)
    featureTensor.dispose()
    labelTensor.dispose()


    //const denormalizeFeatureTensor = denormalized(normalizeFeatureTensor.tensor, normalizeFeatureTensor.min, normalizeFeatureTensor.max)

    const [trainingFT, testingFT] = tf.split(this.normalizeFeature.tensor, 2)
    const [trainingLT, testingLT] = tf.split(this.normalizeLabel.tensor, 2)

    this.testingFeatureTensor = testingFT
    this.testingLabelTensor = testingLT

    this.trainingFeatureTensor = trainingFT
    this.trainingLabelTensor = trainingLT

    this.isLoadingFiles = false


  }

  async testing() {

    this.isTesting = true;
    const lossTensor: Scalar | Scalar[] = await this.model.evaluate(this.testingFeatureTensor, this.testingLabelTensor)
    console.log(lossTensor);

    this.isTesting = false
  }

  async training() {

    this.isTraining = true

    this.model = this.createModel()
    const result = await this.train(this.model, this.trainingFeatureTensor, this.trainingLabelTensor)

    //Calculating Loss
    this.trainingLoss = result.history.loss.pop()
    const validationLoss = result.history.val_loss.pop()

    this.isTraining = false

    console.log(`Training loss: ${this.trainingLoss}`);
    console.log(`Validating loss: ${validationLoss}`);
  }


  toogleVisor() {
    tfvis.visor().toggle()
  }

}
