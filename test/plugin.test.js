'use strict';

const path = require('path');
const expect = require('chai').expect;

const Plugin = require('../lib/plugin');
const Cache = Plugin.Cache;
const Example = require('./plugins/example');

describe('Plugin', () => {
  const testPluginPath = path.join(__dirname, 'plugins', 'example');

  describe('#activate', () => {
    context('when the activation has no errors', () => {
      const plugin = new Plugin(testPluginPath);

      context('when the plugin is not yet loaded', () => {
        beforeEach(() => {
          delete Cache[testPluginPath];
        });

        it('loads the plugin and calls activate on the module', () => {
          expect(plugin.activate()).to.equal('test');
        });

        it('sets the plugin as activated', () => {
          expect(plugin.isActivated).to.equal(true);
        });
      });

      context('when the plugin is loaded', () => {
        it('calls #activate on the loaded module', () => {
          expect(plugin.activate()).to.equal('test');
        });
      });
    });

    context('when the activation errors', () => {
      const errorPluginPath = path.join(__dirname, 'plugins', 'example3');
      const plugin = new Plugin(errorPluginPath);

      before(() => {
        plugin.activate();
      });

      it('sets the plugin as not activated', () => {
        expect(plugin.isActivated).to.equal(false);
      });

      it('sets the plugin error', () => {
        expect(plugin.error.message).to.equal('error');
      });
    });

    context('when loading errors', () => {
      const errorPluginPath = path.join(__dirname, 'plugins', 'example4');
      const plugin = new Plugin(errorPluginPath);

      before(() => {
        plugin.activate();
      });

      it('sets the plugin as not activated', () => {
        expect(plugin.isActivated).to.equal(false);
      });

      it('sets the plugin error', () => {
        expect(plugin.error.message).to.include('Cannot find module');
      });
    });
  });

  describe('#load', () => {
    context('when loading does not error', () => {
      const plugin = new Plugin(testPluginPath);

      it('returns the module', () => {
        expect(plugin.load()).to.equal(Example);
      });

      it('sets the module in the cache', () => {
        expect(Cache[testPluginPath]).to.equal(Example);
      });
    });
  });

  describe('#new', () => {
    const plugin = new Plugin(testPluginPath);

    it('sets the plugin path', () => {
      expect(plugin.pluginPath).to.equal(testPluginPath);
    });

    it('parses the package.json and sets the metadata', () => {
      expect(plugin.metadata.name).to.equal('test-plugin');
    });
  });
});
