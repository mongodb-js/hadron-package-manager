'use strict';

const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const Action = require('../lib/action');
const PackageManager = require('../lib/package-manager');

describe('PackageManager', function() {
  describe('#activate', function() {
    const packagesPath = path.join(__dirname, 'packages');
    const intPackagesPath = path.join(__dirname, 'internal-packages');
    let manager;
    beforeEach(function() {
      manager = new PackageManager(
        [ intPackagesPath, packagesPath ],
        __dirname,
        ['external-packages/example3']
      );
    });

    it('activates all the packages', function(done) {
      const unsubscribe = Action.packageActivationCompleted.listen(function() {
        expect(manager.packages).to.have.length(6);
        unsubscribe();
        done();
      });
      manager.activate();
    });

    it('only calls Action.packageActivationCompleted once', function(done) {
      const spy = sinon.spy();
      const unsubscribe = Action.packageActivationCompleted.listen(spy);
      setTimeout(function() {
        expect(spy.callCount).to.be.equal(1);
        unsubscribe();
        done();
      }, 10);
      manager.activate();
    });
  });

  describe('#new', function() {
    const manager = new PackageManager();

    it('initializes empty packages', function() {
      expect(manager.packages).to.have.length(0);
    });
  });
});
